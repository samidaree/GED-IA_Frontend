import Navigation from './Navigation'
import Logo from './Logo'

/**
 * A React component representing the settings page.
 * @returns {JSX.Element} - The JSX element representing the component.
 */
export default function Settings() {
  function handleValidate() {
    const key = document.getElementById('keyInput').value
    console.log(key)
    localStorage.setItem('openai_key', key)
    const alert = document.getElementById('alertBD')
    console.log(alert)
    alert.classList.add('show')
    alert.classList.remove('hide')
  }
  function closeAlert() {
    const alert = document.getElementById('alertBD')
    alert.classList.add('hide')
  }
  return (
    <div>
      <Logo />
      <Navigation />
      <div className="openai">
        <h1>OpenAI API Key</h1>
        <div className="openai-flex">
          <div className="key">
            <input
              type="text"
              id="keyInput"
              placeholder=" "
            />
            <span>Saisissez une clé API</span>
          </div>
          <button
            className="save"
            onClick={handleValidate}
          >
            <span className="buttonText">Sauvegarder</span>
            <span className="buttonIcon">
              <ion-icon name="save-outline"></ion-icon>{' '}
            </span>
          </button>
        </div>
      </div>
      <div
        id="alertBD"
        className="alertBD hide"
      >
        <ion-icon
          id="iconBD"
          name="checkmark-circle-outline"
        ></ion-icon>{' '}
        <span className="msgBD">Enregistrement effectué</span>
        <span
          className="close-btnBD"
          onClick={closeAlert}
        >
          <ion-icon
            className="closeBD"
            name="close-outline"
          ></ion-icon>
        </span>
      </div>
    </div>
  )
}
