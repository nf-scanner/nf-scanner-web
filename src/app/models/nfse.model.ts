export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
}

export interface Contato {
  telefone: string;
  email: string;
}

export interface Empresa {
  razao_social: string;
  cnpj: string;
  inscricao_municipal: string;
  inscricao_estadual: string | null;
  nome_fantasia: string | null;
  endereco: Endereco;
  contato: Contato;
}

export interface Servico {
  descricao: string;
  codigo_servico: string;
  atividade_descricao: string;
  cnae: string;
  cnae_descricao: string;
  observacoes: string;
}

export interface Valores {
  valor_servicos: string;
  desconto: string;
  valor_liquido: string;
  base_calculo: string;
  aliquota: string;
  valor_iss: string;
  outras_retencoes: string;
  retencoes_federais: string;
}

export interface TributosFederais {
  pis: string;
  cofins: string;
  ir: string;
  inss: string;
  csll: string;
}

export interface NFSe {
  data_hora_emissao: string;
  competencia: string;
  codigo_verificacao: string;
  numero_rps: string;
  local_prestacao: string;
  numero_nfse: string;
  origem: string;
  orgao: string;
  nfse_substituida: string | null;
  prestador: Empresa;
  tomador: Empresa;
  servico: Servico;
  valores: Valores;
  tributos_federais: TributosFederais;
}

export interface NFSeResponse {
  nfse: NFSe;
}
