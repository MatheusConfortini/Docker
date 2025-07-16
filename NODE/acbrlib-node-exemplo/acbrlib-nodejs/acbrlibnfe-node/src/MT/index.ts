import { TAMANHO_PADRAO } from "acbrlib-comum/dist/src/ACBrBuffer";
import { TypeACBrNFeMT } from "./bridge";
import ACBrLibBaseMT from "acbrlib-comum/dist/src/MT";
import ACBrLibNFeBridgeMT from "./bridge";
import { ACBrLibResultCodes } from "acbrlib-comum/dist/src/exception/ACBrLibResultCodes"
import ACBrLibNFeError, {
    ACBrLibNFeCNPJInvalidoError,
    ACBrLibNFeGerarXmlError,
    ACBrLibNFeIndexError
} from "../exception"
import { ACBrLibExecutandoMetodoError } from 'acbrlib-comum/dist/src/exception';

/**
 ** @description ACBrLibNFeMT é uma classe de alto nível que abstrai os métodos da ACBrLibNFE Multi-thread<br/>
 * Esta classe permite que programadores de javascript/typescript usem a ACBrLibNFe sem grandes preocupações.
 */

class ACBrLibNFeMT extends ACBrLibBaseMT {

    /**
     * 
     * @param libraryPath é o caminho da biblioteca acbrlibnfe (*.so ou *.dll)
     * @param arquivoConfig Localização do arquivo INI, pode ser em branco neste caso o ACBrLib vai criar um novo arquivo INI.
     * @param chaveCrypt Chave de segurança para criptografar as informações confidencias, pode ser em branco neste caso será usado a senha padrão.
     */
    constructor(libraryPath: string, arquivoConfig: string, chaveCrypt: string) {
        super(new ACBrLibNFeBridgeMT(libraryPath).getAcbrNativeLib(), arquivoConfig, chaveCrypt)
    }


    public getAcbrlib(): TypeACBrNFeMT;


    public getAcbrlib(): TypeACBrNFeMT {
        return super.getAcbrlib() as TypeACBrNFeMT //cast de any para TypeACBrNFeMT
    }

    protected LIB_Inicializar(handle: any, configPath: string, chaveCrypt: string): number {
        return this.getAcbrlib().NFE_Inicializar(handle, configPath, chaveCrypt)
    }
    protected LIB_Finalizar(handle: any): number {
        return this.getAcbrlib().NFE_Finalizar(handle)
    }
    protected LIB_UltimoRetorno(handle: any, mensagem: Buffer, refTamanho: any): number {
        return this.getAcbrlib().NFE_UltimoRetorno(handle, mensagem, refTamanho)
    }
    protected LIB_Nome(handle: any, nome: Buffer, refTamanho: any): number {
        return this.getAcbrlib().NFE_Nome(handle, nome, refTamanho)
    }
    protected LIB_Versao(handle: any, versao: Buffer, refTamanho: any): number {
        return this.getAcbrlib().NFE_Versao(handle, versao, refTamanho)
    }
    protected LIB_ConfigLer(handle: any, arqConfig: string): number {
        return this.getAcbrlib().NFE_ConfigLer(handle, arqConfig)
    }
    protected LIB_ConfigGravar(handle: any, arqConfig: string): number {
        return this.getAcbrlib().NFE_ConfigGravar(handle, arqConfig)
    }
    protected LIB_ConfigLerValor(handle: any, sessao: string, chave: string, valor: Buffer, refTamanho: any): number {
        return this.getAcbrlib().NFE_ConfigLerValor(handle, sessao, chave, valor, refTamanho)
    }
    protected LIB_ConfigGravarValor(handle: any, sessao: string, chave: string, valor: string): number {
        return this.getAcbrlib().NFE_ConfigGravarValor(handle, sessao, chave, valor)
    }
    protected LIB_ConfigImportar(handle: any, arqConfig: string): number {
        return this.getAcbrlib().NFE_ConfigImportar(handle, arqConfig)
    }
    protected LIB_ConfigExportar(handle: any, configuracoes: Buffer, refTamanho: any): number {
        return this.getAcbrlib().NFE_ConfigExportar(handle, configuracoes, refTamanho)
    }

    protected LIB_OpenSSLInfo(handle: any, configuracoes: Buffer, refTamanho: any): number {
        return this.getAcbrlib().NFE_OpenSSLInfo(handle, configuracoes, refTamanho)
    }

    _checkResult(result: number): void {

        super._checkResult(result);
        switch (result) {
            case ACBrLibResultCodes.OK:
                return 
                break;
            case ACBrLibResultCodes.ErrCNPJInvalido:
                throw new ACBrLibNFeCNPJInvalidoError(this.ultimoRetorno());
                break;

            case ACBrLibResultCodes.ErrGerarXml:
                throw new ACBrLibNFeGerarXmlError(this.ultimoRetorno());
                break;

            case ACBrLibResultCodes.ErrIndex:
                throw new ACBrLibNFeIndexError(this.ultimoRetorno());
                break;

            case ACBrLibResultCodes.ErrExecutandoMetodo:
                throw new ACBrLibExecutandoMetodoError(this.ultimoRetorno());
                break;
            default:
          
                throw new ACBrLibNFeError(this.ultimoRetorno());
                break;
        }


    }
    public carregarXML(arquivoXML: string): number {

        let status = this.getAcbrlib().NFE_CarregarXML(this.getHandle(), arquivoXML)
        this._checkResult(status)
        return status
    }

    /**
     * @description Método usado para ler o arquivo INI para o componente ACBrNFe.
     * @param arquivoXML Path com o nome do arquivo INI a ser lido ou o conteúdo do INI.
     * @returns 0 ou código de erro
     */

    public carregarINI(arquivoXML: string): number {
        let status = this.getAcbrlib().NFE_CarregarINI(this.getHandle(), arquivoXML)
        this._checkResult(status)
        return status
    }

    /**
     * @description Método para retornar o xml da NFe.
     * @param indice Posição da NFe na lista, a lista inicia em 0.
     * @returns 
     */

    public obterXml(indice: number): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_ObterXml(this.getHandle(), indice, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

    /**
     * @description Método para gravar o xml da NFe.
     * @param indice Posição da NFe na lista, a lista inicia em 0.
     * @param nomeArquivo Nome do arquivo xml a ser salvo.
     * @param caminhoArquivo Local onde será salvo o xml.
     * @returns 0 ou código de erro
     */

    public gravarXml(indice: number, nomeArquivo: string, caminhoArquivo: string): number {
        let status = this.getAcbrlib().NFE_GravarXml(this.getHandle(), indice, nomeArquivo, caminhoArquivo)
        this._checkResult(status)
        return status

    }

    /**
   * @description Método para retornar o xml da NFe em formato INI
   * @param indice Posição da NFe na lista, a lista inicia em 0.
   * @returns Uma string com o conteúdo do arquivo XML em formato INI
   */

    public obterIni(indice: number): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_ObterIni(this.getHandle(), indice, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)

    }


    /**
     * @description Método para gravar o xml da NFe em formato ini.
     * @param indice Posição da NFe na lista, a lista inicia em 0.
     * @param nomeArquivo Posição da NFe na lista, a lista inicia em 0.
     * @param caminhoArquivo Posição da NFe na lista, a lista inicia em 0.
     * @returns 0 ou código de erro.
     */

    public gravarIni(indice: number, nomeArquivo: string, caminhoArquivo: string): number {
        let status = this.getAcbrlib().NFE_GravarIni(this.getHandle(), indice, nomeArquivo, caminhoArquivo)
        this._checkResult(status)
        return status

    }

    /**
     * @description Método usado para ler o arquivo XML para o componente ACBrNFe.
     * @param arquivoXML Path com o nome do arquivo XML a ser lido ou o conteúdo do XML.
     * @returns 0 ou código de erro
     */

    public carregarEventoXML(arquivoXML: string): number {
        let status = this.getAcbrlib().NFE_CarregarEventoXML(this.getHandle(), arquivoXML)
        this._checkResult(status)
        return status
    }


    /**
     * @description Método usado para ler o arquivo INI para o componente ACBrNFe.
     * @param arquivoXML Path com o nome do arquivo INI a ser lido ou o conteúdo do INI.
     * @returns 0 ou código de erro
    */

    public carregarEventoINI(arquivoXML: string): number {
        let status = this.getAcbrlib().NFE_CarregarEventoINI(this.getHandle(), arquivoXML)
        this._checkResult(status)
        return status
    }


    /**
    * @description Método usado para limpar a lista de notas no componente ACBrNFe.
    * @returns 0 ou código de erro
    */

    public limparLista() {
        let status = this.getAcbrlib().NFE_LimparLista(this.getHandle())
        this._checkResult(status)
        return status
    }



    /**
   * @description Método usado para limpar a lista de eventos no componente ACBrNFe
   * @returns 0 ou código de erro
   */

    public limparListaEventos() {
        let status = this.getAcbrlib().NFE_LimparListaEventos(this.getHandle())
        this._checkResult(status)
        return status
    }

     /**
     * @description Método usado para assinar as notas carregadas no componente ACBrNFe.
     * @returns 0 ou código de erro.
     */


    public assinar(): number {
        let status = this.getAcbrlib().NFE_Assinar(this.getHandle())
        this._checkResult(status)
        return status
    }

      /**
     * @description Método usado para validar as notas assinadas através do componente ACBrNFe.
     * @returns 0 ou código de erro
     */


    public validar(): number {
        let status = this.getAcbrlib().NFE_Validar(this.getHandle())
        this._checkResult(status)
        return status
    }


      /**
     * @description Método usado para Validar Regras de Negócios dos dados que se encontram no XML de uma NF-e.
     * @returns Uma string com informações da validação
     */


    public validarRegrasdeNegocio(): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_ValidarRegrasdeNegocios(this.getHandle(), acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }



    public verificarAssinatura(): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_VerificarAssinatura(this.getHandle(), acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

      /**
     * @description Método usado gerar uma chave para o documento fiscal.
     * @param ACodigoUF Código da UF para gerar a chave.
     * @param ACodigoNumerico Código numérico da nota fiscal.
     * @param AModelo Modelo do documento 55 ou 65.
     * @param ASerie Série da nota fiscal.
     * @param ANumero Número da nota fiscal.
     * @param ATpEmi Tipo de Emissão:
        - 1 teNormal
        - 2 teContingencia
        - 3 teSCAN
        - 4 teDPEC
        - 5 teFSDA
        - 6 teSVCAN
        - 7 teSVCRS
        - 8 teSVCSP
        - 9 teOffLine
     * @param AEmissao Data da emissão da NFe no formato [dd/MM/yyyy].
     * @param ACNPJCPF CPF/CNPJ do emissor da nota.
     * @returns Uma string com a chave gerada
     */

    public gerarChave(
        ACodigoUF: number, ACodigoNumerico: number, AModelo: number,
        ASerie: number, ANumero: number, ATpEmi: number,
        AEmissao: string, ACNPJCPF: string
    ): string {

        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_GerarChave(this.getHandle(), ACodigoUF, ACodigoNumerico, AModelo, ASerie, ANumero, ATpEmi, AEmissao, ACNPJCPF, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


    /**
     * @description Método usado retornar uma lista de dados do certificados instalados na maquina:
    - Com certificado Instalado no Windows e usando o Wincrypt, basta este metódo; 
    - Usando OpenSSL (Linux/Windows) devemos configurar o INI ( { @link https://acbr.sourceforge.io/ACBrLib/DFe.html | Configurações DFe }  ) informar o path e o arquivo pfx (ArquivoPFX=c:\temp\certificado.pfx) e a senha antes este método.

     */
    public obterCertificados(): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_ObterCertificados(this.getHandle(), acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)

    }

     /**
     * @description Método usado retornar o path onde será salvos os documentos gerado pela biblioteca.
     * @param tipo Tipo de path que será retornado:
      - 0  NFe
      - 1 Inutilização
      - 2 CCe
      - 3 Cancelamento
     * @returns 
     */

    public getPath(tipo: number) {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_GetPath(this.getHandle(), tipo, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


    /**
     * @description Método usado retornar o path onde será salvos os eventos gerado pela biblioteca.
     * @param codigoEvento O código do evento.
     * @returns 0 ou código de erro
     */


    public getPathEvento(codigoEvento: string): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_GetPathEvento(this.getHandle(), codigoEvento, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }
    

    /**
     * @description Método usado para Consultar o Status de Serviço na SEFAZ.
     * @returns Uma string com informações do Status de Serviço
     * @example
     * ```ini 
     *       [STATUS]
     *       Versao=1.07
     *       TpAmb=2
     *       VerAplic=SP_NFE_PL_005c
     *       CStat=107
     *       XMotivo=Serviço em Operação
     *       CUF=35
     *       DhRecbto=2009-03-25T08:44:20
     *       TMed=1
     *   ```
     */

    public statusServico(): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)

        let status = this.getAcbrlib().NFE_StatusServico(this.getHandle(), acbrBuffer.getBuffer(),acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

     /**
     * Método usado para consultar um NFe na SEFAZ.
     * @param eChaveOuNFe Path com o nome do arquivo XML a ser consultado ou o conteúdo do XML.
     * @param AExtrairEventos Informe se deve ou não extrair os eventos, se houver os mesmos na reposta.
     * @returns Uma string com o resultado da consulta da NFe
     * @example
     * ```ini
     * [CONSULTA]
    * Versao=1.07
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * CStat=100
    * XMotivo=Autorizado o uso da NF-e
    * CUF=35
    * ChNFe=350XXXXXXXXXXXXXXXX550010000000220000000229
    * DhRecbto=2009-03-24T20:19:38
    * NProt=1350900073XXXXX
    * DigVal=OZl9uzQ+JVFPxNuqBJ/ex7TTxhc=
     * ```
     */

    public consultar(eChaveOuNFe: string, AExtrairEventos: boolean): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_Consultar(this.getHandle(), eChaveOuNFe, AExtrairEventos, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

     /**
     * @description Método usado para consultar o recibo de envio na SEFAZ.
     * @param recibo Número do recibo para consulta.
     * @returns Uma string com o resultado da consulta do recibo
     * @example
     * ```ini
     * [RETORNO]
    * Versao=1.10
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * NRec=35000000XXXXXXX
    * CStat=104
    * XMotivo=Lote processado
    * CUF=35
    * 
    [NFE28]
    * Versao=1.07
    * Id=
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * CStat=100
    * XMotivo=Autorizado o uso da NF-e
    * CUF=35
    * ChNFe=350XXXXXXXXXXXXXXXXX550010000000280000000281
    * DhRecbto=2009-03-25T09:25:04
    * NProt=13509000XXXXXXX
    * DigVal=UNTpscTtknjN5UOBUHa9PZPHJnE=
    * ```
     */


    public consultarRecibo(recibo: string): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_ConsultarRecibo(this.getHandle(), recibo, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }
    
     /**
     * @description Método usado para consultar o cadastro da SEFAZ.
     * @param cUF Sigla do estado do documento a ser consultado.
     * @param nDocumento Número do documento a ser consultado.
     * @param nIE Se passado true irá consultar pelo documento Inscrição Estadual, caso contrário irá consultar pelo CPF ou CNPJ. 
     * @returns Uma string com o resultado da consultado do cadastro na SEFAZ.
     * @example
     * ```ini
     * [ConsultaCadastro]
    * CNPJ=87942294000159
    * CPF=
    * CStat=111
    * CUF=35
    * IE=897894648764
    * Msg=
    * UF=SP
    * VerAplic=SP_NFE_PL009_V4
    * Versao=2.00
    * XMotivo=Consulta cadastro com uma ocorrência
    * dhCons=17/12/2019 15:29:35
    * tpAmb=
    * 
    [INFCAD001]
    * CEP=18270170
    * CNAE=6204000
    * CNPJ=87942294000159
    * CPF=
    * IE=897894648764
    * IEAtual=
    * IEUnica=
    * UF=SP
    * arquivo=
    * cMun=3554003
    * cSit=1
    * dIniAtiv=27/08/2013
    * dUltSit=27/08/2013
    * nro=963
    * xBairro=CENTRO
    * xCpl=
    * xFant=
    * xLgr=RUA CORONEL AURELIANO DE CAMARGO
    * xMun=TATUI
    * xNome=PROJETO ACBR CONSULTORIA LTDA
    * xRegApur=SIMPLES NACIONAL
     * ```
     */

    public consultaCadastro(cUF: string, nDocumento: string, nIE: boolean): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_ConsultaCadastro(this.getHandle(), cUF, nDocumento, nIE, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


     /**
     * @description Método usado para gerar o PDF do DANFe de um NFe carregado.
     * @returns 0 ou código de erro 
     */

    public imprimirPDF(): number {
        let status = this.getAcbrlib().NFE_ImprimirPDF(this.getHandle())
        this._checkResult(status)
        return status
    }

       /**
     * @description Método usado para Inutilizar um numero ou faixa de números na SEFAZ.
     * @param CNPJ CNPJ do emitente
     * @param justificativa Motivo por estar solicitando a Inutilização.
     * @param ano Ano.
     * @param modelo Modelo deve ser informado 55 para NF-e ou 65 para NFC-e.
     * @param serie Serie do Documento Fiscal.
     * @param numeroInicial Numero Inicial a que se deseja Inutilizar.
     * @param numeroFinal Numero Final a se se deseja Inutilizar.
     * @returns 
     * @example
     * ```ini
     *  [Inutilizacao]
        * Msg=
        * Versao=
        * tpAmb=
        * VerAplic=
        * CStat=
        * XMotivo=
        * CUF=
        * DhRecbto=
        * NomeArquivo=
        * Xml=
     * ```
     */

    public inutilizar(CNPJ: string, justificativa: string, ano: number, modelo: number, serie: number, numeroInicial: number, numeroFinal: number): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_Inutilizar(this.getHandle(), CNPJ, justificativa, ano, modelo, serie, numeroInicial, numeroFinal, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


    /**
     * @description Método usado para enviar um lote de NFe para SEFAZ.
     * @param lote Numero do Lote a ser enviado.
     * @param imprimir Se True imprime o DANFe caso o NF-e for autorizado.
     * @param sincrono Se True imprime o envia em modo síncrono.
     * @param zipado Se True imprime o envia o arquivo zipado.
     * @returns Um string com o resultado do envio do lote para SEFAZ
     * @example
     * ```ini
     * [ENVIO]
    * Versao=1.10
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * CStat=103
    * XMotivo=Lote recebido com sucesso
    * CUF=35
    * NRec=35000000XXXXXXX
    * DhRecbto=2009-03-25T09:25:04
    * TMed=1
    * 
    [RETORNO]
    * Versao=1.10
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * NRec=35000000XXXXXXX
    * CStat=104
    * XMotivo=Lote processado
    * CUF=35
    * 
    [NFE28]
    * Versao=1.07
    * Id=
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * CStat=100
    * XMotivo=Autorizado o uso da NF-e
    * CUF=35
    * ChNFe=350XXXXXXXXXXXXXXXXX550010000000280000000281
    * DhRecbto=2009-03-25T09:25:04
    * NProt=13509000XXXXXXX
    * DigVal=UNTpscTtknjN5UOBUHa9PZPHJnE=
     * ```
     */

    public enviar(lote: number, imprimir: boolean, sincrono: boolean, zipado: boolean): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_Enviar(this.getHandle(), lote, imprimir, sincrono, zipado, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

     /**
     * @description Método usado para Cancelar um NFe na SEFAZ.
     * @param chave Chave de acesso do XML a ser cancelado.
     * @param justificativa Motivo do cancelamento. 
     * @param CNPJ CNPJ do emitente.
     * @param lote Numero do Lote do evento de cancelamento.
     * @returns 
     * ```ini
     * [CANCELAMENTO]
    * Versao=1.07
    * TpAmb=2
    * VerAplic=SP_NFE_PL_005c
    * CStat=101
    * XMotivo=Cancelamento de NF-e homologado
    * CUF=35
    * ChNFe=350XXXXXXXXXXXXXXXXX550010000000220000000229
    * DhRecbto=2009-03-25T08:50:50
    * NProt=2009-03-25T08:50:50
    * tpEvento=
    * xEvento=
    * nSeqEvento=
    * CNPJDest=
    * emailDest=
    * XML=
     * ```
     */

    public cancelar(chave: string, justificativa: string, CNPJ: string, lote: number): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_Cancelar(this.getHandle(), chave, justificativa, CNPJ, lote, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


     /**
     * @description Método usado para Enviar um Evento para SEFAZ.
     * @param idLote Numero do Lote do evento.
     * @returns 
     * ```ini
     * [Evento]
    * idLote=
    * cOrgao=
    * 
    [EVENTO001]
    * tpAmb=
    * VerAplic=
    * CStat=
    * XMotivo=
    * chNFe=
    * nProt=
    * arquivo=
    * digVal=
    * Id=
    * cOrgao=
    * dhRegEvento=
    * tpEvento=
    * xEvento=
    * nSeqEvento=
    * CNPJDest=
    * emailDest=
    * XML=
     * ```
     */

    public enviarEvento(idLote: number): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_EnviarEvento(this.getHandle(), idLote, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


      /**
     * @description Método usado para Baixar documentos do Ambiente Nacional através do método DistribuicaoDFe informando o último NSU retornado pela execução anterior.
     * @param ufAutor Código da UF do autor da consulta.
     * @param eCNPJCPF CNPJ/CPF do autor da consulta.
     * @param eultNSU Numero do ultimo NSU.
     * @returns 
     */


    public distribuicaoDFePorUltNSU(ufAutor: string, eCNPJCPF: string, eultNSU: string): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_DistribuicaoDFePorUltNSU(this.getHandle(), ufAutor, eCNPJCPF, eultNSU, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }
     /**
    * @description Método usado para Baixar o documento do Ambiente Nacional através do método DistribuicaoDFe informando o seu NSU.
    * @param ufAutor Código da UF do autor da consulta.
    * @param eCNPJCPF CNPJ/CPF do autor da consulta.
    * @param eNSU Numero do NSU do documento.
    * @returns Uma string com o { @link  https://acbr.sourceforge.io/ACBrLib/NFE_DistribuicaoDFePorNSU.html | documento}  solicitado
    */

    public distribuicaoDFePorNSU(ufAutor: number, eCNPJCPF: string, eNSU: string): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_DistribuicaoDFePorNSU(this.getHandle(), ufAutor, eCNPJCPF, eNSU, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

    /**
     * @description Método usado para Baixar o NFe do Ambiente Nacional através do método DistribuicaoDFe informando o a sua chave.
     * @param ufAutor Código da UF do autor da consulta.
     * @param eCNPJCPF CNPJ/CPF do autor da consulta.
     * @param eChave Chave do NFe.
     * @returns Uma string com a NFe baixada do Ambiente Nacional
     */

    public distribuicaoDFePorChave(ufAutor: number, eCNPJCPF: string, eChave: string): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_DistribuicaoDFePorChave(this.getHandle(), ufAutor, eCNPJCPF, eChave, acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }

     /**
     * @description Método usado para enviar e-mail através do componente ACBrNFe.
     * @param ePara Destinatário.
     * @param eXMLNFe Path ou conteúdo do xml.
     * @param enviaPDF Se True gera o PDF do DANFe e anexa ao e-mail.
     * @param eAssunto Texto contendo o assunto do e-mail.
     * @param eCC endereços separados por ponto e vírgula que receberão uma cópia do e-mail.
     * @param eAnexos Path com o nome de arquivos separados por ponto e vírgula a serem anexados ao e-mail.
     * @param eMensagem Texto referente a mensagem do e-mail.
     * @returns 0 ou código de erro
     */

    public enviarEmail(ePara: string, eXMLNFe: string, enviaPDF: boolean, eAssunto: string, eCC: string, eAnexos: string, eMensagem: string): number {
        let status = this.getAcbrlib().NFE_EnviarEmail(this.getHandle(), ePara, eXMLNFe, enviaPDF, eAssunto, eCC, eAnexos, eMensagem)
        this._checkResult(status)
        return status
    }

    
    /**
     * @description Método usado para enviar evento por e-mail através do componente ACBrNFe.
     * @param ePara Destinatário.
     * @param eChaveEvento Path com o nome do arquivo XML do Evento a ser anexado ao e-mail.
     * @param eChaveNFe Path com o nome do arquivo XML do NFe a ser anexado ao e-mail.
     * @param enviaPDFSe True gera o PDF do DANFe e anexa ao e-mail.
     * @param eAssunto Texto contendo o assunto do e-mail.
     * @param eCC endereços separados por ponto e vírgula que receberão uma cópia do e-mail.
     * @param eAnexos Path com o nome de arquivos separados por ponto e vírgula a serem anexados ao e-mail.
     * @param eMensagem 
     * @returns 0 ou código de erro
     */


    public enviarEmailEvento(ePara: string, eChaveEvento: string, eChaveNFe: string, enviaPDF: boolean, eAssunto: string, eCC: string, eAnexos: string, eMensagem: string): number {
        let status = this.getAcbrlib().NFE_EnviarEmailEvento(this.getHandle(), ePara, eChaveEvento, eChaveNFe, enviaPDF, eAssunto, eCC, eAnexos, eMensagem)
        this._checkResult(status)
        return status
    }

     /**
     * @description Método usado para imprimir o DANFe/DANFCe dos NFes/NFCes carregados.
     * @param cImpressora Nome da impressora onde será impresso o documento, senão informado será usado a impressora informada nas configurações.
     * @param nNumCopias Quantidade de copias a ser impresso, informe zero para usar o valor informado nas configurações.
     * @param cProtocolo Número do protocolo da NFe.
     * @param bMostrarPreview Se informado "True" exibira o preview, se "False" senão quiser mostra ou vazio para usar os valores das configurações.
     * @param cMarcaDagua Define o caminho da imagem que será usada como marca d'água na impressão da DANFe, senão informado será usado o valor da configuração. 
     * @param bViaConsumidor Se informado "True" imprimira a via do consumidor, se "False" senão quiser mostra ou vazio para usar os valores das configurações, valido apenas para NFCe.
     * @param bSimplificado Se informado "True"  imprimira a DANFCe de forma simplificada, se "False" senão quiser mostra ou vazio para usar os valores das configurações, valido apenas para NFCe.
     * @returns 0 ou código de erro
     */



    public imprimir(cImpressora: string, nNumCopias: number, cProtocolo: string, bMostrarPreview: string, cMarcaDagua: string, bViaConsumidor: string, bSimplificado: string): number {
        let status = this.getAcbrlib().NFE_Imprimir(this.getHandle(), cImpressora, nNumCopias, cProtocolo, bMostrarPreview, cMarcaDagua, bSimplificado, bViaConsumidor)
        this._checkResult(status)
        return status
    }

     /**
     * @description Método usado para gerar o PDF do DANFe de um NFe carregado.
     * @returns 0 ou código de erro
     */


    public salvarPDF(): string {
        let acbrBuffer = this._createAcbrBuffer(TAMANHO_PADRAO)
        let status = this.getAcbrlib().NFE_SalvarPDF(this.getHandle(), acbrBuffer.getBuffer(), acbrBuffer.getRefTamanhoBuffer())
        this._checkResult(status)
        return this._processaResult(acbrBuffer)
    }


    /**
     * @description Método usado para imprimir um evento.
     * @param eArquivoXmlNFe Path do arquivo XML da NFe para impressão.
     * @param eArquivoXmlEvento Path do arquivo XML do evento para impressão.
     * @returns 0 ou código de erro
     */

    public imprimirEvento(eArquivoXmlNFe: string, eArquivoXmlEvento: string): number {
        let status = this.getAcbrlib().NFE_ImprimirEvento(this.getHandle(), eArquivoXmlNFe, eArquivoXmlEvento)
        this._checkResult(status)
        return status
    }


    /**
     * @description Método usado para gerar o PDF de um evento.
     * @param eArquivoXmlNFe Path do arquivo XML da NFe para impressão.
     * @param eArquivoXmlEvento Path do arquivo XML do evento para impressão.
     * @returns 
     */

    public imprimirEventoPDF(eArquivoXmlNFe: string, eArquivoXmlEvento: string): number {
        let status = this.getAcbrlib().NFE_ImprimirEventoPDF(this.getHandle(), eArquivoXmlNFe, eArquivoXmlEvento)
        this._checkResult(status)
        return status
    }

    
     /**
     * @description Método usado para imprimir a Inutilização.
     * @param eArquivoXml Path do arquivo XML da inutilização para impressão.
     * @returns 0 ou código de erro
     */


    public imprimirInutilizacao(eArquivoXml: string): number {
        let status = this.getAcbrlib().NFE_ImprimirInutilizacao(this.getHandle(), eArquivoXml)
        this._checkResult(status)
        return status
    }

      
   
    /**
     * @description Método usado para gerar o PDF da Inutilização
     * @param eArquivoXml Path do arquivo XML da inutilização para impressão.
     * @returns 
     */

    public salvarInutilizacaoPDF(eArquivoXml: string): number {
        let status = this.getAcbrlib().NFE_SalvarInutilizacaoPDF(this.getHandle(), eArquivoXml)
        this._checkResult(status)
        return status
    }

    
     /**
     * @description Método usado para salvar o PDF de um evento em formato Base64.
     * @param eArquivoXmlNFe Path do arquivo XML da NFe para  formato Base64.
     * @param eArquivoXmlEvento Path do arquivo XML do evento para  formato Base64.
     * @returns 0 ou código de erro
     */

    public salvarEventoPDF(eArquivoXmlNFe: string, eArquivoXmlEvento: string): number {
        let status = this.getAcbrlib().NFE_SalvarEventoPDF(this.getHandle(), eArquivoXmlNFe, eArquivoXmlEvento)
        this._checkResult(status)
        return status
    }

      /**
     * @description Método usado para gerar o PDF da Inutilização
     * @param eArquivoXml Path do arquivo XML da inutilização para impressão.
     * @returns 
     */

    public imprimirInutilizacaoPDF(eArquivoXml: string): number {
        let status = this.getAcbrlib().NFE_ImprimirInutilizacaoPDF(this.getHandle(), eArquivoXml)
        this._checkResult(status)
        return status
    }

}

export default ACBrLibNFeMT