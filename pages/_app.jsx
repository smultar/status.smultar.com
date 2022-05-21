
// SCSS Import
import '../public/styles/index.scss';

// Modules
import ProgressBar from "nextjs-progressbar";

function App({ Component, pageProps: { session, ...pageProps} }) {

  return (
    <>
      <ProgressBar height={2} color='#197CF7' showOnShallow={true}/>
      <Component {...pageProps} />
    </>
  )
}

export default App
