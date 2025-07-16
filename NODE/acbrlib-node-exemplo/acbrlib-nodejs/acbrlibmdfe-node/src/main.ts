import ACBrLibmdfe from ".";
import path from 'path'
import os from 'os'

function configuraSessaoDfe() {
    let status = mdfe.configGravarValor("DFe", "SSLCryptLib", "1")
    let senhaPfx = ""
    status = mdfe.configGravarValor("DFe", "SSLHttpLib", "3")
    status = mdfe.configGravarValor("DFe", "SSLXmlSignLib", "4")
    status = mdfe.configGravarValor("DFe", "ArquivoPFX", pfxPath)
    console.log("status gravar arquivoPFX  = ", status)
    //configura senha 
    status = mdfe.configGravarValor("DFe", "Senha", senhaPfx)
    console.log("status gravar senha  = ", status)


    
    status = mdfe.configGravar(configPath)
   

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

    mdfe.configGravarValor("mdfe", "PathSalvar",path.resolve(__dirname, "data"));

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

    let configExportada = mdfe.configExportar()

    console.log("exportar:\n\n", configExportada + "\n\n")

    let sslInfo = mdfe.openSslInfo() 
    console.log(sslInfo)
}

function getLibraryNameByPlatform(): string {
    let currentLib = ""
    const libnames = {

        "linux-x64": "libacbrmdfe64.so",
        "linux-ia32": "libacbrmdfe32.so",
        "win32-x64": "ACBrmdfe64.dll",
        "win32-ia32": "ACBrmdfe32.dll"
    }

    let currentPlaform = os.platform() + "-" + os.arch()
    switch (currentPlaform) {

        case "linux-x64":
            currentLib = libnames["linux-x64"]
            break;

        case "linux-ia32":
            currentLib = libnames["linux-ia32"]
            break

        case "win32-x64":
            currentLib = libnames["win32-x64"]
            break

        case "win32-ia32":
            currentLib = libnames["win32-ia32"]
            break

        default:
            new Error("sistema operaciona não suportado")
    }

    return currentLib

}

//sessao de variaveis 

let libraryPath = path.resolve(__dirname, "..", "libs", getLibraryNameByPlatform())
let configPath = path.resolve(__dirname, "data", "acbrlib.ini")
let mdfeIniPath = path.resolve(__dirname, "data", "mdfe_Teste_Emissao31.ini")

let logPath = path.resolve(__dirname, "data", "log")
let schemasPath = path.resolve(__dirname, 'data', 'Schemas','mdfe')
let pfxPath = path.resolve(__dirname, "data", "PROJETO_ACBR_CONSULTORIA_SA18760540000139_2024.pfx")
let mdfe = new ACBrLibmdfe(libraryPath,configPath,"")

let xmlPath = path.resolve(__dirname, "data", "notas")
let pathPDF = path.resolve(__dirname, "data", "pdf")





let status = mdfe.inicializar()


//xecutaComandosDaLibComum()
configuraSessaoPrincipal()
configuraSessaomdfe()
configuraSessaoDfe()
configuraDAmdfe()

mdfe.configGravar()
mdfe.configLer()

console.log(mdfe.configLerValor("DFe","Senha"))

try {
let statusServico =  mdfe.statusServico()
    let  statusServicoJson = JSON.stringify(statusServico)
    console.log(statusServico)
}catch(error){
    console.log(error)
    false
}



//status = mdfe.finalizar()
console.log("finalizar = ", status)









