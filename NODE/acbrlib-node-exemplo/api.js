const express = require('express');
const app = express();

const { ACBrLibCepService, ACBrNFeService, ACBrMDFeService } = require('./helper');


function info(acbrlib) {
    if (!acbrlib) {
        return {
            nome: "ACBrLib",
            versao: "0.0.0"
        }
    }

    let versao = acbrlib.versao();
    let nome = acbrlib.nome();
    return {
        nome: nome,
        versao: versao,
    }
}
app.get('/nfe/info', function (req, res) {
    let nfe;

    try {

        nfe = new ACBrNFeService().acbrlib;
        let data = info(nfe);
        res.send(data)

    } catch (e) {
        console.log(e)
        res.json({
            status: "Erro ao consultar informações"
        }).status(500);
    }
    finally {
        nfe.finalizar()
    }


});

app.get('/nfe/status', function (req, res) {
    let nfe
    try {
        nfe = new ACBrNFeService().acbrlib;
        let data = nfe.statusServico();
        res.send(JSON.parse(data))

    } catch (e) {
        console.log(e)
        res.json({
            status: "Erro ao consultar status do serviço"
        }).status(500);
    } finally {
        nfe.finalizar()
    }

})
app.get('/cep/info', function (req, res) {
    let cep
    let data
    try {
        cep = new ACBrLibCepService().acbrlib;
        data = info(cep);
        console.log(data)
        res.send(data)

    } catch (e) {
        console.log(e)
        res.json({
            status: "Erro ao consultar versão"
        }).status(500);
    } finally {
        cep.finalizar()
    }

}
);
app.get('/cep/:cep', function (req, res) {

    let data = ""
    let cep
    try {
        cep = new ACBrLibCepService().acbrlib;
        data = cep.buscarPorCep(req.params.cep);

        res.send({
            data: JSON.parse(data),
            status: "ok"

        })

    } catch (e) {
        console.log(e)
        console.log("data" + data)
        res.json({
            status: "Erro ao consultar CEP"
        }).status(500);
    } finally {
        cep.finalizar()
    }

}
);

app.get('/mdfe/info', function (req, res) {
    let mdfe
    try {
        mdfe = new ACBrMDFeService().acbrlib;
        let data = info(mdfe);
        res.send(data)

    } catch (e) {
        console.log(e)
        res.json({
            status: "Erro ao consultar versão"
        }).status(500);
    } finally {
        mdfe.finalizar()
    }

}
);

const PORT = 3333;
app.listen(PORT, () => {
    console.log('Rodando na porta: ' + PORT);
});
