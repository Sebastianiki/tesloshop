import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';

import { 
	Box, Button, capitalize, Card, CardActions, 
	CardMedia, Checkbox, Chip, Divider, FormControl, 
	FormControlLabel, FormGroup, FormLabel, Grid,
	Radio, RadioGroup, TextField } 
from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AdminLayout } from '../../../components/layouts'
import { IProduct, ISize, IType } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { watch } from 'fs';
import { tesloApi } from '../../../api';
import { parseObject } from '../../../utils/helpers';
import { Product } from '../../../models';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
	_id         : string;
  description : string;
  images      : string[];
  inStock     : number;
  price       : number;
  sizes       : ISize[];
  slug        : string;
  tags        : string[];
  title       : string;
  type        : IType;
	gender      : string;
}

interface Props {
	product: IProduct;
}

const ProductAdminPage:NextPage<Props> = ({ product }) => {

	const router = useRouter()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [tag, setTag] = useState('')
	const [isSaving, setIsSaving] = useState(false)

	const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch} = useForm<FormData>({
		defaultValues: product
	})


	useEffect(() => {
		const subscription = watch(( value, { name, type }) => {
			if(name === 'title') {
				const newSlug = value.title?.trim().replaceAll(' ', '_').replaceAll("'", '').replaceAll('-', '_').toLocaleLowerCase() || ''
				setValue('slug', newSlug)
			}
		})

		return () => subscription.unsubscribe()
	}, [watch, setValue])
	

	const onChangeSize = (size:ISize) => {
		const currentSizes = getValues('sizes')
		if( currentSizes.includes(size) ) return setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true })
		setValue('sizes', [ ...currentSizes, size ], { shouldValidate: true })
	}

	const onAddTag = () => {
		const newTag = tag.trim().toLocaleLowerCase()
		setTag('')
		const currentTag = getValues('tags') // hace referencia al array del estado del form
		if(currentTag.includes(newTag)) return
		currentTag.push(newTag) // push afecta al array al que hace referencia
	}

	const onDeleteTag = (tag: string) => {
		const updatedTags = getValues('tags').filter(t => t !== tag)
		setValue('tags', updatedTags, { shouldValidate: true })
	}

	const onFileSelected = async ({ target:{ files }}: ChangeEvent<HTMLInputElement>) => {
		if(!files || files.length === 0) return
		try {
			for(const file of files){
				const formData = new FormData()
				formData.append('file', file)
				const { data:{ message } } = await tesloApi.post<{ message: string }>('/admin/upload', formData)
				setValue('images', [...getValues('images'), message], { shouldValidate: true })
			}
		} catch (error) {
			
		}
	}

	const onDeleteImage = (image:string) => {
		setValue('images', getValues('images').filter( img => img !== image), { shouldValidate: true })
	}

	const onSubmitForm = async(formData:FormData) => {
		if(formData.images.length < 2 ) return alert('minimo 2 imagenes')
		setIsSaving(true)
		try {
			const { data } = await tesloApi({
				url: '/admin/products',
				method: formData._id ? 'PUT' : 'POST',
				data: formData
			})
			if ( !formData._id ) router.replace(`/admin/products/${ formData.slug }`)
			else setIsSaving(false)
		} catch (error) {
			console.log(error)
			setIsSaving(false)
		}
	}

	return (
		<AdminLayout
			title={'Producto'}
			subTitle={`Editando: ${product.title}`}
			icon={<DriveFileRenameOutline />}
		>
			<form onSubmit={ handleSubmit( onSubmitForm )}>
				<Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
					<Button
						color="secondary"
						startIcon={<SaveOutlined />}
						sx={{ width: '150px' }}
						type="submit"
						disabled={isSaving}
					>
						Guardar
					</Button>
				</Box>

				<Grid container spacing={2}>
					{/* Data */}
					<Grid item xs={12} sm={6}>

						<TextField
							label="Título"
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{ ...register('title', {
									required: 'Este campo es requerido',
									minLength: { value: 5, message: 'Mínimo 5 caracteres' }
							})}
							error={ !!errors.title }
							helperText={ errors.title?.message }
						/>

						<TextField
							label="Descripción"
							variant="filled"
							fullWidth
							multiline
							rows={4}
							sx={{ mb: 1 }}
							{ ...register('description', {
								required: 'Este campo es requerido',
								minLength: { value: 5, message: 'Mínimo 5 caracteres' }
							})}
							error={ !!errors.description }
							helperText={ errors.description?.message }
						/>

						<TextField
							label="Inventario"
							type='number'
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{ ...register('inStock', {
								required: 'Este campo es requerido',
								min: { value: 0 , message: 'Debe de agregar minimo una existencia'}
							})}
							error={ !!errors.inStock }
							helperText={ errors.inStock?.message }
						/>

						<TextField
							label="Precio"
							type='number'
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{ ...register('price', {
								required: 'Este campo es requerido',
								min: { value: 0 , message: 'Debe de agregar un precio mayor a 0'}
							})}
							error={ !!errors.price }
							helperText={ errors.price?.message }
						/>

						<Divider sx={{ my: 1 }} />

						<FormControl sx={{ mb: 1 }}>
							<FormLabel>Tipo</FormLabel>
							<RadioGroup
								row
								value={ getValues('type')}
								onChange={ ({ target:{ value } }) => setValue('type', value as IType, { shouldValidate: true }) }
							>
								{
									validTypes.map(option => (
										<FormControlLabel
											key={option}
											value={option}
											control={<Radio color='secondary' />}
											label={capitalize(option)}
										/>
									))
								}
							</RadioGroup>
						</FormControl>

						<FormControl sx={{ mb: 1 }}>
							<FormLabel>Género</FormLabel>
							<RadioGroup
								row
								value={ getValues('gender')}
								onChange={ ({ target:{ value } }) => setValue('gender', value, { shouldValidate: true }) }
							>
								{
									validGender.map(option => (
										<FormControlLabel
											key={option}
											value={option}
											control={<Radio color='secondary' />}
											label={capitalize(option)}
										/>
									))
								}
							</RadioGroup>
						</FormControl>

						<FormGroup>
							<FormLabel>Tallas</FormLabel>
							{
								validSizes.map(size => (
									<FormControlLabel 
										key={size} 
										control={<Checkbox checked={ getValues('sizes').includes(size as ISize)  ? true : false } />} 
										label={size} 
										onChange={ () => onChangeSize(size as ISize) }
									/>
								))
							}
						</FormGroup>

					</Grid>

					{/* Tags e imagenes */}
					<Grid item xs={12} sm={6}>
						<TextField
							label="Slug - URL"
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							{ ...register('slug', {
								required: 'Este campo es requerido',
								validate: (val) => val.trim().includes(' ') ? 'No puede haber espacios en blanco' : undefined
							})}
							error={ !!errors.slug }
							helperText={ errors.slug?.message }
						/>

						<TextField
							label="Etiquetas"
							variant="filled"
							fullWidth
							sx={{ mb: 1 }}
							helperText="Presiona [spacebar] para agregar"
							value={tag}
							onChange={ ({ target:{ value }}) => setTag(value)}
							onKeyPress={({ code }) => code === 'Space' && onAddTag()}
						/>

						<Box sx={{
							display: 'flex',
							flexWrap: 'wrap',
							listStyle: 'none',
							p: 0,
							m: 0,
						}}
							component="ul">
							{
								getValues('tags').map((tag) => {

									return (
										<Chip
											key={tag}
											label={tag}
											onDelete={() => onDeleteTag(tag)}
											color="primary"
											size='small'
											sx={{ ml: 1, mt: 1 }}
										/>
									);
								})}
						</Box>

						<Divider sx={{ my: 2 }} />

						<Box display='flex' flexDirection="column">
							<FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
							<Button
								color="secondary"
								fullWidth
								startIcon={<UploadOutlined />}
								sx={{ mb: 3 }}
								onClick={ () => fileInputRef.current?.click() }
							>
								Cargar imagen
							</Button>
							<input
								ref={ fileInputRef }
								type='file'
								multiple
								accept='image/png, image/gif, image/jpeg'
								style={{ display: 'none' }}
								onChange={ onFileSelected }
							/>

							{
								getValues('images').length < 2 && (
									<Chip
										label="Es necesario al 2 imagenes"
										color='error'
										variant='outlined'
									/>
								)
							}

							<Grid container spacing={2}>
								{
									getValues('images').map(img => (
										<Grid item xs={4} sm={3} key={img}>
											<Card>
												<CardMedia
													component='img'
													className='fadeIn'
													image={`${img}`}
													alt={img}
												/>
												<CardActions>
													<Button 
														fullWidth 
														color="error"
														onClick={ ()=> onDeleteImage(img)}
													>
														Borrar
													</Button>
												</CardActions>
											</Card>
										</Grid>
									))
								}
							</Grid>

						</Box>

					</Grid>

				</Grid>
			</form>
		</AdminLayout>
	)
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

	const { slug = '' } = query;

	let product:IProduct | null

	if( slug === 'new_product' ) {
		const tempProduct = parseObject(new Product())
		delete tempProduct._id;
		tempProduct.images = ['img1.jpg', 'img2.jpg']
		product = tempProduct
	}
	else product = await dbProducts.getProductBySlug(slug.toString());

	if (!product) { return { redirect: { destination: '/admin/products', permanent: false, } } }

	return {
		props: {
			product
		}
	}
}


export default ProductAdminPage