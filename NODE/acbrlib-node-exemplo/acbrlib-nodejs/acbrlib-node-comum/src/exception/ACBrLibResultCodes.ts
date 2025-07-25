export enum ACBrLibResultCodes {
    OK = 0,
    ErrLibNaoInicializada = -1,
    ErrLibNaoFinalizada = -2,
    ErrConfigLer = -3,
    ErrConfigGravar = -4,
    ErrArquivoNaoExiste = -5,
    ErrDiretorioNaoExiste = -6,
    ErrHttp = -7,
    ErrParametroInvalido = -8,
    ErrExecutandoMetodo = -10,
    ErrCNPJInvalido = -11,
    ErrCPFInvalido = -12,
    ErrIndex = -13,
    ErrGerarXml = -14,
    ErrNaoDisponivelEmModoConsole = -15,
    ErrTimeOut = -19,
    ErrDemoExpirado = -999
}
