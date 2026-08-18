// superclasse ou classe mãe
class validaCPF {
    constructor(cpfEnviado) {
        // Usamos o defineProperty para configurar
        Object.defineProperty(this, 'cpfLimpo', {
            enumerable: true,
            writable: false,
            configurable: false,
            value: cpfEnviado.replace(/\D+/g, '')  // Com esta expressão regular pegaremos a string e removeremos os sinais de ponto, traço e espaço que existir
        })
    }

    // função que impossibilita que um usuario digite numeros em sequencia em vez do cpf verdadeiro
    éSequencia() {
        return this.cpfLimpo.charAt(0).repeat(11) === this.cpfLimpo;
    }

    // Função que vai gerar um novo cpf com os 9 primeiros digitos do cpf enviado, mas os dois digitos que serão calculados por outra função de acorod com o calculo do governo de validação
    geraNovoCPF() {
        const cpfSemDigito = this.cpfLimpo.slice(0, -2); // Reduzido o cpf apenas para os primeiros 9 dígitos necessários para a conta, inicialmente
        const digito1 = validaCPF.geraDigito(cpfSemDigito);
        const digito2 = validaCPF.geraDigito(cpfSemDigito + digito1); // A proxima chamada no metodo geraDigito acrescentamos o decimo digito encontrado
        this.novoCPF = cpfSemDigito + digito1 + digito2; // completamos o CPF a partir dos dois ultimos digitos que seriam conforme a regra de validação

    }

    // Como em nenhum momento chamado por this, assim, não utiliza da instância na função. Podemos torná-la estática
    static geraDigito(cpfSemDigito) {
        const cpfArray = Array.from(cpfSemDigito); // transformando os 9 primeiros dígitos em um array para a manipulação dos dígitos para o cálculo

        let regressivo = cpfArray.length + 1; // Será usado o total de dígitos regressivamente 
        const total = cpfArray.reduce((ac, val) => {
            ac += (Number(val) * regressivo);
            regressivo--;
            return ac;
        }, 0); // Usa-se o reduce para criar um sequencia regressiva até a quantidade do array. Assim pode-se extrair o total da regressão multiplicada pelo respectivo elemento do array com os digitos do cpf
        const digito = 11 - (total % 11); // Este total será usado na regra de validação do decimo primeiro e segundo digito do CPF
        return digito > 9 ? '0' : String(digito); //Expressão ternaria para seguir a regra de validação, se o digito depois do calculo da regra for maior que 9, o proximo digito do CPF terá que ser zero.
    }

    // Compara se o cpf gerado é igual ao cpf enviado, confirmando um cpf válido ou não 
    valida() {
        if (!this.cpfLimpo) return false;
        if (typeof this.cpfLimpo !== 'string') return false;
        if (this.cpfLimpo.length !== 11) return false;
        if (this.éSequencia()) return false;
        this.geraNovoCPF()


        return this.novoCPF === this.cpfLimpo; // comparamos o CPF obtido com a validação com o que o usuario digitou. Se forem iguais, CPF correto segundo as regras do governo de validação
    };
}

const cpf = new validaCPF('070.987.730-03');

if (cpf.valida()) {
    console.log('CPF válido!')
} else {
    console.log('CPF inválido!')
}

