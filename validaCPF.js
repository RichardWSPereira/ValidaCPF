// Exemplo de CPF válido: 210.774.740-75
// Esta função construtora irá comparar o CPF enviado pelo usuário com o obtido através dos cálculos de validação, caso os dois últimos dígitos foram iguais, CPF válido
function ValidaCPF(cpfEnviado) {
    Object.defineProperty(this,'cpfLimpo',{
        get: function() {
            return cpfEnviado.replace(/\D+/g,''); // Com esta expressão regular pegaremos a string e removeremos os sinais de ponto, traço e espaço que existir
        }
    });
}

ValidaCPF.prototype.valida = function() {
    if(typeof this.cpfLimpo === 'undefined') return false; // Checando se não está vazia
    if(this.cpfLimpo.length !== 11) return false; // Checagem se tem 11 dígitos
    if(this.isSequencia()) return false; // Validando se o usuario digitou numero em sequência.

    const cpfParcial = this.cpfLimpo.slice(0,-2); // Reduzido o cpf apenas para os primeiros 9 dígitos necessários para a conta, inicialmente
    const digito1 = this.criaDigito(cpfParcial); 
    const digito2 = this.criaDigito(cpfParcial + digito1); // A proxima chamada no metodo criaDigito acrescentamos o decimo digito encontrado
    
    const cpfNovo = cpfParcial + digito1 + digito2; // completamos o CPF a partir dos dois ultimos digitos que seriam conforme a regra de validação

    return cpfNovo === this.cpfLimpo; // comparamos o CPF obtido com a validação com o que o usuario digitou. Se forem iguais, CPF correto segundo as regras do governo de validação
};

// Método onde validaremos através da conta se o CPF é válido
ValidaCPF.prototype.criaDigito = function(cpfParcial) {
    const cpfArray = Array.from(cpfParcial); // transformando os 9 primeiros dígitos em um array para a manipulação dos dígitos para o cálculo

    let regressivo = cpfArray.length + 1; // Será usado o total de dígitos regressivamente 
    const total = cpfArray.reduce((ac,val) => {
        ac += (Number(val) * regressivo);
        regressivo--;
        return ac;
    },0); // Usa-se o reduce para criar um sequencia regressiva até a quantidade do array. Assim pode-se extrair o total da regressão multiplicada pelo respectivo elemento do array com os digitos do cpf
    const digito = 11 - (total % 11); // Este total será usado na regra de validação do decimo primeiro e segundo digito do CPF
    return digito > 9 ? '0' : String(digito); //Expressão ternaria para seguir a regra de validação, se o digito depois do calculo da regra for maior que 9, o proximo digito do CPF terá que ser zero.
}

// método para saber se o usuario digitou um CPF com os números iguais 
ValidaCPF.prototype.isSequencia = function(){
    const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
    return sequencia === this.cpfLimpo;
}
const cpf = new ValidaCPF('210.774.740-75');

if(cpf.valida()) {
    console.log('CPF válido!')
} else {
    console.log('CPF inválido!')
}

