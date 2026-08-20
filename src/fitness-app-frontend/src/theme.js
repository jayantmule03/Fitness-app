import { createTheme } from '@mui/material/styles';


export const colors = {
  ink: '#0F1115',
  surface: '#171B21',
  surfaceRaised: '#1E232B',
  hairline: 'rgba(245,246,247,0.08)',
  pulse: '#FF4630',       // effort / primary
  pulseSoft: '#FF7A52',
  cool: '#33E5D8',        // recovery / secondary
  volt: '#B6FF3C',        // rare "PR / achievement" highlight only
  textPrimary: '#F3F5F7',
  textMuted: '#8B93A1',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: colors.ink, paper: colors.surface },
    primary: { main: colors.pulse, light: colors.pulseSoft, contrastText: '#0F1115' },
    secondary: { main: colors.cool, contrastText: '#0F1115' },
    success: { main: colors.volt, contrastText: '#0F1115' },
    text: { primary: colors.textPrimary, secondary: colors.textMuted },
    divider: colors.hairline,
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.05 },
    h2: { fontFamily: '"Archivo Black", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.08 },
    h3: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 600 },
    subtitle1: { color: colors.textMuted },
    button: { fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, textTransform: 'none', letterSpacing: '0.01em' },
    overline: { fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.14em', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(circle at 15% 0%, rgba(255,70,48,0.08), transparent 45%), radial-gradient(circle at 85% 10%, rgba(51,229,216,0.06), transparent 40%)',
          backgroundAttachment: 'fixed',
        },
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-thumb': { backgroundColor: '#2A303A', borderRadius: 8 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, padding: '10px 22px', boxShadow: 'none' },
        containedPrimary: {
          backgroundImage: `linear-gradient(135deg, ${colors.pulse} 0%, ${colors.pulseSoft} 100%)`,
          boxShadow: '0 10px 24px -10px rgba(255,70,48,0.65)',
          '&:hover': { boxShadow: '0 12px 28px -8px rgba(255,70,48,0.8)', backgroundImage: `linear-gradient(135deg, ${colors.pulseSoft} 0%, ${colors.pulse} 100%)` },
        },
        outlined: { borderColor: colors.hairline, '&:hover': { borderColor: colors.pulse, backgroundColor: 'rgba(255,70,48,0.06)' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.hairline}`,
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: {
      defaultProps: { variant: 'filled' },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surfaceRaised,
          borderRadius: 12,
          '&:before, &:after': { display: 'none' },
          '&:hover': { backgroundColor: '#242A33' },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          border: `1px solid ${colors.hairline}`,
          color: colors.textMuted,
          '&.Mui-selected': {
            color: '#0F1115',
            backgroundColor: colors.pulse,
            '&:hover': { backgroundColor: colors.pulseSoft },
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontFamily: '"JetBrains Mono", monospace', fontWeight: 600 } } },
  },
});

export default theme;
