const ACBrLibNFeMT = require('acbrlibnfe-node/dist/src/MT').default
const ACBrLibMDFeMT = require('acbrlibmdfe-node/dist/src/MT').default
const ACBrLibCepMT = require('acbrlibcep-node/dist/src/MT').default
const path = require('path');
const pathDllACBrLibNFe ='libacbrnfe64.so';
const pathDllACBrLibCep = 'libacbrcep64.so';
const pathDllACBrLibMDFe ='libacbrmdfe64.so';

const socketLogPath = path.resolve(__dirname,'..','log')
const logPath = path.resolve(__dirname, '..', "log")
const pathSalvar = path.resolve(__dirname, '..', "pdf")
const acbrlibINI = path.resolve(__dirname, '..', 'ACBrLib.ini')
const acbrlibCepINI = path.resolve(__dirname, '..', 'ACBrLibCep.ini')
const pfxPath = path.resolve(__dirname, '..', "data", "cert.pfx")
const schemasPath = path.resolve(__dirname, '..', "Schemas", "NFe")

class ACBrLibBaseService {
    constructor(acbrlib){
        this.acbrlib = acbrlib;
        this.acbrlib.inicializar()
        this._aplicarConfiguracoes()
    }

    _aplicarConfiguracoes() {
        this.acbrlib.configGravarValor("Principal", "LogPath", logPath)
        this.acbrlib.configGravarValor("Principal", "LogNivel", "4")
        this.acbrlib.configGravarValor("Principal", "TipoResposta", "2")
        this.acbrlib.configGravar()
        this.acbrlib.configLer()
    }
    
}
class ACBrLibCepService  extends ACBrLibBaseService {
    constructor() {
      super(new ACBrLibCepMT(pathDllACBrLibCep, acbrlibCepINI, ""))
    }

    _aplicarConfiguracoes() {
        super._aplicarConfiguracoes()
        this.acbrlib.configGravarValor("CEP","WebService", "3")
        this.acbrlib.configGravarValor("Socket","NivelLog","4")
        this.acbrlib.configGravarValor("Socket","LogPath",socketLogPath)    
        this.acbrlib.configGravar()
        this.acbrlib.configLer()
    }
}


class ACBrMDFeService extends ACBrLibBaseService {
    constructor() {
        super(new ACBrLibMDFeMT(pathDllACBrLibMDFe, acbrlibINI, ""))
    }

    _aplicarConfiguracoes() {
        super._aplicarConfiguracoes()
        this.acbrlib.configGravarValor("MDFe", "PathSalvar", path.resolve(__dirname, "data", "xml"));
        this.acbrlib.configGravar()
        this.acbrlib.configLer()
    }
}

class ACBrNFeService extends ACBrLibBaseService {

    constructor() {
        super(new ACBrLibNFeMT(pathDllACBrLibNFe, acbrlibINI, ""))
    }

    _configuraSessaoDfe() {
        let senhaPfx = process.env.PFX_PASS;

        this.acbrlib.configGravarValor("DFe", "SSLCryptLib", "1")
        this.acbrlib.configGravarValor("DFe", "SSLHttpLib", "3")
        this.acbrlib.configGravarValor("DFe", "SSLXmlSignLib", "4")
        this.acbrlib.configGravarValor("DFe", "ArquivoPFX", pfxPath)
        this.acbrlib.configGravarValor("DFe", "Senha", senhaPfx)
        this.acbrlib.configGravar(acbrlibINI)
        this.acbrlib.configGravarValor("NFE", "PathSalvar", path.resolve(__dirname, "data", "xml"));


    }

    _configuraDANFE() {
        this.acbrlib.configGravarValor("DANFE", "PathPDF", pathSalvar)
    }

    _configuraSessaoNFe() {

        //configurar schemas 
        this.acbrlib.configGravarValor("NFE", "PathSchemas", schemasPath)

        //seta ambiente de homologação
        this.acbrlib.configGravarValor("NFE", "Ambiente", "1")

    }


    _aplicarConfiguracoes() {
        super._aplicarConfiguracoes()
        this._configuraSessaoNFe()
        this._configuraSessaoDfe()
        this._configuraDANFE()
        this.acbrlib.configGravar()
        this.acbrlib.configLer()
    }


}

module.exports = {
    ACBrNFeService,
    ACBrMDFeService,
    ACBrLibCepService
}
