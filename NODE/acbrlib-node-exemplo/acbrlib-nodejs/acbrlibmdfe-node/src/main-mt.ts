import path from "path"
import ACBrLibMDFeMT from "./MT"
import { ACBrLibExecutandoMetodoError } from "acbrlib-comum/dist/src/exception"


//sessao de variaveis 

let dataDir = path.resolve(__dirname,"data")


console.log("data = ",dataDir)
let libraryPath = path.resolve(__dirname, ".." ,"libs","MT",  "libacbrmdfe64.so")
let configPath = path.resolve(__dirname, "acbrlib.ini")
let mdfeIniPath = path.resolve(dataDir, "mdfe_Teste_Emissao31.ini")

let logPath = path.resolve(dataDir, "log")
let schemasPath = path.resolve(dataDir, 'Schemas', 'mdfe')
let pfxPath = path.resolve(dataDir, "cert.pfx")
let mdfe = new ACBrLibMDFeMT(libraryPath,configPath, "")
let status = mdfe.inicializar()
let xmlPath = path.resolve(dataDir, "notas")
let pathPDF = path.resolve(dataDir, "pdf")





function configuraSessaoDfe() {
    let status = mdfe.configGravarValor("DFe", "SSLCryptLib", "1")
    let senhaPfx = process.env.SENHA_PFX||"";
   
    status = mdfe.configGravarValor("DFe", "SSLHttpLib", "3")
    
    status = mdfe.configGravarValor("DFe", "SSLXmlSignLib", "4")
    
    status = mdfe.configGravarValor("DFe", "ArquivoPFX", pfxPath)
    //configura senha 
    
    status = mdfe.configGravarValor("DFe", "Senha", senhaPfx)

   // console.log("senha", senhaPfx)

    console.log("status gravar arquivoPFX  = ", status)
    
    status = mdfe.configGravar(configPath)

    console.log("status gravar arquivoPFX  = ", status)

    mdfe.configGravarValor("mdfe", "PathSalvar",path.resolve(__dirname, "data","xml"));


}

function configuraDAmdfe() {
    status = mdfe.configGravarValor("DAmdfe", "PathPDF", pathPDF)
}

function configuraSessaomdfe() {

    //configurar schemas 
    let status = mdfe.configGravarValor("mdfe", "PathSchemas", schemasPath)

    //seta ambiente de homologação
    status = mdfe.configGravarValor("mdfe", "Ambiente", "1")
    console.log("status gravar schemasPath  = ", status)

    //configura pfxPath 


}

function configuraSessaoPrincipal() {
    //configurar log
    let status = mdfe.configGravarValor("Principal", "LogPath", logPath)
    console.log("status gravar logPath  = ", status)

    //configurar logNivel 
    status = mdfe.configGravarValor("Principal", "LogNivel", "4")
    console.log("status gravar log  = ", status)


    mdfe.configGravarValor("Principal","TipoResposta","2")
}


function executaComandosDaLibComum() {

    let mdfeNome = mdfe.nome()
    console.log("nome = ", mdfeNome)
    let mdfeVersao = mdfe.versao()

    console.log("versao = ", mdfeVersao)

    let mdfeUltimoRetorno = mdfe.ultimoRetorno()

    console.log("ultimoRetorno = ", mdfeUltimoRetorno)

    let logNivel = mdfe.configLerValor("Principal", "LogNivel")

    console.log("log nivel = ", logNivel)

    //let configExportada = mdfe.configExportar()

    //console.log("exportar:\n\n", configExportada + "\n\n")

    let sslInfo = mdfe.openSslInfo()

    console.log (sslInfo)
}


executaComandosDaLibComum()

configuraSessaoPrincipal()
configuraSessaomdfe()
configuraSessaoDfe()
configuraDAmdfe()

mdfe.configGravar()
mdfe.configLer()


try {
    let statusServico =  mdfe.statusServico()
    let statusServicoJSon = JSON.parse(statusServico)
    console.log(statusServicoJSon)
}catch(error){
    if ( error instanceof ACBrLibExecutandoMetodoError){
    
    console.log(error)
    }
}
mdfe.finalizar()
mdfe.inicializar()
executaComandosDaLibComum()
mdfe.finalizar()