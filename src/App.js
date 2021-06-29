import { useState } from 'react';
import './App.css';

import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'

import Tesseract from 'tesseract.js';

import DropzoneComponent from 'react-dropzone-component';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function validarLargoCBU(cbu) {
  if (cbu.length != 22) { return false }
  return true
}

function validarCodigoBanco(codigo) {
  if (codigo.length != 8) { return false }
  var banco = codigo.substr(0, 3)
  var digitoVerificador1 = codigo[3]
  var sucursal = codigo.substr(4, 3)
  var digitoVerificador2 = codigo[7]

  var suma = banco[0] * 7 + banco[1] * 1 + banco[2] * 3 + digitoVerificador1 * 9 + sucursal[0] * 7 + sucursal[1] * 1 + sucursal[2] * 3

  var diferencia = 10 - (suma % 10)

  return diferencia == digitoVerificador2
}

function validarCuenta(cuenta) {
  if (cuenta.length != 14) { return false }
  var digitoVerificador = cuenta[13]
  var suma = cuenta[0] * 3 + cuenta[1] * 9 + cuenta[2] * 7 + cuenta[3] * 1 + cuenta[4] * 3 + cuenta[5] * 9 + cuenta[6] * 7 + cuenta[7] * 1 + cuenta[8] * 3 + cuenta[9] * 9 + cuenta[10] * 7 + cuenta[11] * 1 + cuenta[12] * 3
  var diferencia = 10 - (suma % 10)
  return diferencia == digitoVerificador
}

function validarCBU(cbu) {
  return validarLargoCBU(cbu) && validarCodigoBanco(cbu.substr(0, 8)) && validarCuenta(cbu.substr(8, 14))
}

const bancos = {
  '005': 'The Royal Bank of Scotland N.V.',
  '007': 'Banco de Galicia y Buenos Aires S.A.',
  '011': 'Banco de la Nación Argentina',
  '014': 'Banco de la Provincia de Buenos Aires',
  '015': 'Industrial and Commercial Bank of China S.A.',
  '016': 'Citibank N.A.',
  '017': 'BBVA Banco Francés S.A.',
  '018': 'The Bank of Tokyo-Mitsubishi UFJ, LTD.',
  '020': 'Banco de la Provincia de Córdoba S.A.',
  '027': 'Banco Supervielle S.A.',
  '029': 'Banco de la Ciudad de Buenos Aires',
  '030': 'Central de la República Argentina',
  '034': 'Banco Patagonia S.A.',
  '044': 'Banco Hipotecario S.A.',
  '045': 'Banco de San Juan S.A.',
  '046': 'Banco do Brasil S.A.',
  '060': 'Banco de Tucumán S.A.',
  '065': 'Banco Municipal de Rosario',
  '072': 'Banco Santander Río S.A.',
  '083': 'Banco del Chubut S.A.',
  '086': 'Banco de Santa Cruz S.A.',
  '093': 'Banco de la Pampa Sociedad de Economía Mixta',
  '094': 'Banco de Corrientes S.A.',
  '097': 'Banco Provincia del Neuquén S.A.',
  '143': 'Brubank S.A.U.',
  '147': 'Banco Interfinanzas S.A.',
  '150': 'HSBC Bank Argentina S.A.',
  '165': 'JP Morgan Chase Bank NA (Sucursal Buenos Aires)',
  '191': 'Banco Credicoop Cooperativo Limitado',
  '198': 'Banco de Valores S.A.',
  '247': 'Banco Roela S.A.',
  '254': 'Banco Mariva S.A.ī',
  '259': 'Banco Itaú Argentina S.A.',
  '262': 'Bank of America National Association',
  '266': 'BNP Paribas',
  '268': 'Banco Provincia de Tierra del Fuego',
  '269': 'Banco de la República Oriental del Uruguay',
  '277': 'Banco Sáenz S.A.',
  '281': 'Banco Meridian S.A.',
  '285': 'Banco Macro S.A.',
  '295': 'American Express Bank LTD. S.A.',
  '299': 'Banco Comafi S.A.',
  '300': 'Banco de Inversión y Comercio Exterior S.A.',
  '301': 'Banco Piano S.A.',
  '305': 'Banco Julio S.A.',
  '309': 'Nuevo Banco de la Rioja S.A.',
  '310': 'Banco del Sol S.A.',
  '311': 'Nuevo Banco del Chaco S.A.',
  '312': 'MBA Lazard Banco de Inversiones S.A.',
  '315': 'Banco de Formosa S.A.',
  '319': 'Banco CMF S.A.',
  '321': 'Banco de Santiago del Estero S.A.',
  '322': 'Banco Industrial S.A.',
  '325': 'Deutsche Bank S.A.',
  '330': 'Nuevo Banco de Santa Fe S.A.',
  '331': 'Banco Cetelem Argentina S.A.',
  '332': 'Banco de Servicios Financieros S.A.',
  '336': 'Banco Bradesco Argentina S.A.',
  '338': 'Banco de Servicios y Transacciones S.A.',
  '339': 'RCI Banque S.A.',
  '340': 'BACS Banco de Crédito y Securitización S.A.',
  '341': 'Más Ventas S.A.',
  '384': 'Wilobank S.A.',
  '386': 'Nuevo Banco de Entre Ríos S.A.',
  '389': 'Banco Columbia S.A.',
  '405': 'Ford Credit Compañía Financiera S.A.',
  '406': 'Metrópolis Compañía Financiera S.A.',
  '408': 'Compañía Financiera Argentina S.A.',
  '413': 'Montemar Compañía Financiera S.A.',
  '415': 'Transatlántica Compañía Financiera S.A.',
  '428': 'Caja de Crédito Coop. La Capital del Plata LTDA.',
  '431': 'Banco Coinag S.A.',
  '432': 'Banco de Comercio S.A.',
  '434': 'Caja de Crédito Cuenca Coop. LTDA.',
  '437': 'Volkswagen Credit Compañía Financiera S.A.',
  '438': 'Cordial Compañía Financiera S.A.',
  '440': 'Fiat Crédito Compañía Financiera S.A.',
  '441': 'GPAT Compañía Financiera S.A.',
  '442': 'Mercedes-Benz Compañía Financiera Argentina S.A.',
  '443': 'Rombo Compañía Financiera S.A.',
  '444': 'John Deere Credit Compañía Financiera S.A.',
  '445': 'PSA Finance Argentina Compañía Financiera S.A.',
  '446': 'Toyota Compañía Financiera de Argentina S.A.',
  '448': 'Finandino Compañía Financiera S.A.',
  '992': 'Provincanje S.A.',
};

function getBanco(cbu) {
  return bancos[cbu.substr(0, 3)] || '';
}

function App() {
  const [cbus, setCBUs] = useState([]);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(false);

  const addCBUs = (list) => setCBUs([...list, ...cbus])

  const recognize = async (file) => {
    const { data } = await Tesseract.recognize(
      file,
      'eng',
      {
        tessedit_char_whitelist: '0123456789',
        logger: m => {
          if (m.progress) {
            setProgress(m.progress);
          }
          if (m.status) {
            setStatus(m.status);
          }
          console.log(m)
        }
      }
    )
    console.log(data.text);
    const detectedCBUs = data.text.match(/\d{22}/g);
    if (detectedCBUs) {
      addCBUs([...new Set(detectedCBUs.filter(validarCBU))]);
    }
  }


  return (
    <div className="content">
      <h1>CBU reader</h1>
      <p>Leer CBU desde una screenshot (captura de pantalla) y copiarlo</p>

      <DropzoneComponent config={{ postUrl: 'no-url' }}
        eventHandlers={{ addedfile: async (file) => { await recognize(file); } }}
        djsConfig={{
          autoProcessQueue: false, multiple: false
        }} />

      {progress > 0 && progress < 1 &&
        <div className="status">
          <p>{status}</p>
          <div class="progress">
            <div class="progress-bar-blue" style={{ width: `${progress * 100}%` }}></div>
          </div>
        </div>
      }

      {!!cbus.length &&
        <div className="results">
          <h2>Resultados</h2>
          {cbus.map(cbu => <>
            <p>{getBanco(cbu)}</p>
            <div>
              <input value={cbu} readOnly />
              <CopyToClipboard text={cbu}>
                <button>Copiar</button>
              </CopyToClipboard>
            </div>
          </>)}
        </div>
      }

      <p className="disclaimer">La app se ejecuta en el cliente y no almacena ningún dato ni se transmite
        por la red.<br /> Por debajo utiliza un modelo de OCR de tesseract.js</p>

    </div>
  );
}

export default App;
