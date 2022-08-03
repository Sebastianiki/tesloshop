import { UiState } from './';

type UiType =
 | { type: '[UI] - ToggleMenu' }

export const uiReducer = ( state: UiState, action:UiType ):UiState => {

  switch (action.type) {
    case '[UI] - ToggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      }
    default:
      return state;
  }
}