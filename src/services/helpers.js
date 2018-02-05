export function getLanguageColour (language) {
  switch (language) {
    case 'JavaScript':
      return '#f1e05a'
    case 'Go':
      return '#375eab'
    case 'Shell':
      return '#89e051'
    case 'C':
      return '#555555'
    case 'Ruby':
      return '#701516'
    default:
      return '#333'
  }
}
