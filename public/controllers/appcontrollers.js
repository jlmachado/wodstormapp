var AppControllers = angular.module('AppControllers', ['ui.bootstrap']);

// Este controller pode ser redefinido, caso a estrategia de utilizacao do controle de acesso (proposito deste) seja
// alterada.
AppControllers.controller("menuCtrl", ["$scope", "$rootScope", "controleAcessoResource", function ($scope, $rootScope, controleAcessoResource) {
	$rootScope.sideBarIsVisible = true;
	$rootScope.headerIsVisible  = true;
	controleAcessoResource.get({}, function(response){	
		$scope.itensControleAcesso = response.data;
	});

	$scope.verificaPermissaoAcesso = function (componente) {
		if ($scope.itensControleAcesso) {
			var regra = $scope.itensControleAcesso.filter(function(item) {
				if (item.componente == componente) {
					return item;
				}
			});

			// Permissao = 2 significa permissao de execucao.
			if(regra.length) return regra[0].permissao == 2;
		}

		return null;
	}
}]);

AppControllers.controller('LoginController', ['$scope', 'loginService', function ($scope, loginService) {
	var loginStorage = JSON.parse(localStorage.getItem('wodStormLogin'));
	if(loginStorage){
		$scope.loginDataset = {usuario:loginStorage.usuario, organizacao:loginStorage.organizacao};
	}

	$scope.teste = false;

	$scope.login = function(){
		loginService.login($scope.loginDataset);
	}
}]);

AppControllers.controller('LogoutController', ['$scope', 'loginService', function ($scope, loginService) {

	loginService.logout();	

}]);


AppControllers.controller('DashboardController', ['$scope', 'DashboardResource', function ($scope, DashboardResource) {
	$scope.dashboardDataset = null;
	$scope.tituloAniversariantes = "Aniversariantes do Mês";
	$scope.columnsAniversariantes = [
	{name: "nome", label: "Nome", order: "1", tipo: 'text'},
	{name: "data_nasc", label: "Data", order: "2", tipo: 'text'}
	];
	$scope.botoesAniversariantes = [
	{
		label: "Imprimir",
		route: "#/relAniversariantes"
	}
	];

	$scope.tituloPlanosVencendo = "Planos Vencendo";
	$scope.columnsPlanosVencendo = [
	{name: "nome", label: "Nome", order: "1", tipo: 'text'},
	{name: "data_fim", label: "Data", order: "2", tipo: 'date'}
	];

	$scope.tituloEstacionamentoVencido = "Estacionamento Vencido";
	$scope.columnsEstacionamentoVencido = [
	{name: "nome", label: "Nome", order: "1", tipo: 'text'},
	{name: "plano_fim", label: "Data", order: "2", tipo: 'date'}
	];

	$scope.tituloEstacionamentoTrancado = "Estacionamento Trancado";
	$scope.columnsEstacionamentoTrancado = [
	{name: "nome", label: "Nome", order: "1", tipo: 'text'},
	{name: "placa", label: "Placa", order: "2", tipo: 'text'}
	];

	$scope.tituloPlanosTrancados = "Planos Trancado";
	$scope.columnsPlanosTrancados = [
	{name: "nome", label: "Nome", order: "1", tipo: 'text'}
	];

	$scope.loadDashboard = function(){
		DashboardResource.get({}, function(response){
			$scope.dashboardDataset = response.data;
		});
	};

	$scope.alunosDashboardDataset = null;
	$scope.currentPage = 1;
	$scope.itemsPerPage = 10;
	$scope.maxSize = 10;
	$scope.buscarAlunosDashboard = function(tipo){
		DashboardResource.alunos({tipo:tipo}, function(response){
			$scope.alunosDashboardDataset = response.data.alunos;
		});
	};

	$scope.fecharAlunosDashboard = function(){
		$scope.alunosDashboardDataset = null;
	};
}]);

AppControllers.controller('Page404Controller', ['$scope', '$rootScope', function($scope, $rootScope){
	
}]);

AppControllers.controller('PlanoController', ['$scope','$routeParams', '$location', 'PlanoResource', function ($scope, $routeParams, $location, PlanoResource) {
	$scope.planoDataset = null;

	$scope.carregaPlano = function(){
		PlanoResource.get({},function(response){
			$scope.planoDataset = response.data;
		});
	};

	$scope.carregaCadPlano = function(){
		PlanoResource.get({id_plano : $routeParams.plano}, function(response){
			if(!angular.isArray(response.data)){
				$scope.planoDataset = response.data;
			}
		});
	};

	$scope.salvaPlano = function(){
		var plano = $scope.planoDataset;
		PlanoResource.save(plano, function(response){
			$location.path('/plano');
		});
	};

	$scope.cancelaEdicaoPlano = function(){
		$location.path('/plano');
	};

	$scope.deletaPlano = function(plano){
		if(confirm('Realmente deseja apagar?')){
			PlanoResource.remove({id_plano: plano.id_plano}, function(response){
				$scope.carregaPlano();
			});			
		}
	};

}]);

AppControllers.controller('FormaPagamentoController', ['$scope', '$routeParams', '$location', 'FormaPagamentoResource', function($scope, $routeParams, $location, FormaPagamentoResource){
	$scope.formapagamentoDataset = null;
	
	$scope.carregaFormaPagamento = function(){
		FormaPagamentoResource.get({id_forma_pagamento : $routeParams.formapagamento},function(response){
			$scope.formapagamentoDataset = response.data;
		});
	};

	$scope.carregaCadFormaPagamento = function(){
		FormaPagamentoResource.get({id_forma_pagamento : $routeParams.formapagamento}, function(response){
			if(!angular.isArray(response.data)){
				$scope.formapagamentoDataset = response.data;
			}
		});
	};

	$scope.salvaFormaPagamento = function(){
		var formapagamento = $scope.formapagamentoDataset;
		FormaPagamentoResource.save(formapagamento, function(response){
			$location.path('/formapagamento');
		});
	};

	$scope.cancelaEdicaoFormaPagamento = function(){
		$location.path('/formapagamento');
	};

	$scope.deletaFormaPagamento = function(formapagamento){
		if(confirm('Realmente deseja apagar?')){
			FormaPagamentoResource.remove({id_forma_pagamento: formapagamento.id_forma_pagamento}, function(response){
				$scope.carregaFormaPagamento();
			});
		}
	};
}]);

AppControllers.controller('DescontoController', ['$scope','$routeParams', '$location', 'DescontoResource', function ($scope, $routeParams, $location, DescontoResource) {
	$scope.descontoDataset = null;

	$scope.carregaDesconto = function(){
		DescontoResource.get({}, function(response){
			$scope.descontoDataset = response.data;
		});
	};

	$scope.carregaCadDesconto = function(){
		DescontoResource.get({id_desconto: $routeParams.desconto}, function(response){
			if(!angular.isArray(response.data)){
				$scope.descontoDataset = response.data;	
			}
		});
	};

	$scope.salvaDesconto = function(){
		var desconto = $scope.descontoDataset;
		DescontoResource.save(desconto, function(response){
			$location.path('/desconto');
		});
	};

	$scope.cancelaEdicaoDesconto = function(){
		$location.path('/desconto');
	};

	$scope.deletaDesconto = function(desconto){
		if(confirm('Realmente deseja apagar?')){
			DescontoResource.remove({id_desconto : desconto.id_desconto}, function(response){
				$scope.carregaDesconto();
			});
		}
	};
}]);

AppControllers.controller('EstacionamentoController', ['$scope','$routeParams', '$location', 'EstacionamentoResource','$timeout', function ($scope, $routeParams, $location, EstacionamentoResource, $timeout) {
	$scope.estacionamentoDataset = null;
	$scope.cadEstacionamentoDataset = null;
	$scope.selectAluno = null;

	$scope.carregaEstacionamento = function(){
		EstacionamentoResource.get({}, function(response){
			$scope.estacionamentoDataset = response.data.estacionamento;
		});
	};

	$scope.carregaCadEstacionamento = function(){
		EstacionamentoResource.get({id_estacionamento: $routeParams.estacionamento}, function(response){
			$scope.selectAluno = response.data.selectAluno;	
			$timeout(function(){
				if(!angular.isArray(response.data.estacionamento)){
					$scope.cadEstacionamentoDataset = response.data.estacionamento;	
				}
			});
		});
	};

	$scope.salvaEstacionamento = function(){
		var estacionamento = $scope.cadEstacionamentoDataset;

		planoInicio = estacionamento.plano_ini;

		if (planoInicio instanceof Date) {
			planoInicio = planoInicio.getFullYear() + "-" + ("00"+(planoInicio.getMonth()+1)).substr(-2) + "-" + planoInicio.getDate();
		}

		estacionamento.plano_ini = planoInicio;

		planoFim = estacionamento.plano_fim;

		if (planoFim instanceof Date) {
			planoFim = planoFim.getFullYear() + "-" + ("00"+(planoFim.getMonth()+1)).substr(-2) + "-" + planoFim.getDate();
		}

		estacionamento.plano_fim = planoFim;

		EstacionamentoResource.save(estacionamento, function(response){
			$location.path('/estacionamento');
		});
	};

	$scope.cancelaEdicaoEstacionamento = function(){
		$location.path('/estacionamento');
	};

	$scope.deletaEstacionamento = function(estacionamento){
		if(confirm('Realmente deseja apagar?')){
			EstacionamentoResource.remove({id_estacionamento : estacionamento.id_estacionamento}, function(response){
				$scope.carregaEstacionamento();
			});
		}
	};
}]);

AppControllers.controller('AulaExpController', ['$scope', '$routeParams', '$location', 'AulaExpResource', function($scope, $routeParams, $location, AulaExpResource){
	$scope.aulaexpDataset = null;
	$scope.aulaexpFilter = null;

	$scope.$watch('aulaexpFilter', function(newValue){
		if(newValue){
			angular.forEach(newValue, function(item, key){
				if(item == ''){
					delete newValue[key];
				}
			});
			localStorage.setItem('wsAulaExpFilter', JSON.stringify(newValue));	
		}
	}, true);

	$scope.carregaAulaExp = function(){
		var aulaexpFilter = localStorage.getItem('wsAulaExpFilter') ? JSON.parse(localStorage.getItem('wsAulaExpFilter')) : {};
		$scope.aulaexpFilter = aulaexpFilter;

		AulaExpResource.get({id_aulaexp : $routeParams.aulaexp},function(response){
			$scope.aulaexpDataset = response.data;
		});
	};

	$scope.carregaCadAulaExp = function(){
		AulaExpResource.get({id_aulaexp : $routeParams.aulaexp}, function(response){
			if(!angular.isArray(response.data)){
				$scope.aulaexpDataset = response.data;
			}
		});
	};

	$scope.salvaAulaExp = function(){
		var aulaexp = $scope.aulaexpDataset;
		data_aula = aulaexp.data_aula;

		if (data_aula instanceof Date) {
			data_aula = data_aula.getFullYear() + "-" + ("00"+(data_aula.getMonth()+1)).substr(-2) + "-" + data_aula.getDate();
		}

		aulaexp.data_aula = data_aula;

		AulaExpResource.save(aulaexp, function(response){
			$location.path('/aulaexp');
		});
	};

	$scope.cancelaEdicaoAulaExp = function(){
		$location.path('/aulaexp');
	};

	$scope.deletaAulaExp = function(aulaexp){
		if(confirm('Realmente deseja apagar?')){
			AulaExpResource.remove({id_aulaexp: aulaexp.id_aulaexp}, function(response){
				$scope.carregaAulaExp();
			});
		}
	};
}]);

AppControllers.controller('RelAlunoController', ['$scope', 'RelAlunoResource', function ($scope, RelAlunoResource) {
	$scope.relalunoDataset = null;
	$scope.relAlunoResponseDataset = null;
	$scope.selectAluno = null;
	
	$scope.carregaRelAluno = function(){
		RelAlunoResource.get({},function(response){
			$scope.selectAluno = response.data;	
		});
	};

	$scope.pesquisaRelAluno = function(){
		var pesquisa = $scope.relalunoDataset;
		RelAlunoResource.pesquisa(pesquisa,function(response){
			$scope.relAlunoResponseDataset = response.data;
		});	
	};

}]);


AppControllers.controller('AlunoController', ['$scope', 'AlunoResource', 'ConsultaCepResource', '$location', '$routeParams', function ($scope, AlunoResource, ConsultaCepResource,$location, $routeParams) {
	$scope.alunoDataset = null;
	$scope.cadAlunoDataset = null;
	$scope.alunoFilter = null;

	$scope.tituloAluno = "Alunos";
	$scope.columnsAluno = [
		{name: "nome", label: "Nome", order: "1"},
		{name: "email", label: "Email", order: "2"},
		{name: "tel_celular", label: "Celular", order: "3"},
		{name: "data_fim", label: "Fim Contrato", order: "4"}
	];

	$scope.titulo                = $scope.tituloAluno;
	$scope.gridData              = $scope.alunoDataset;
	$scope.currentPage           = 1;
	$scope.itemsPerPage          = 10;
	$scope.showInputItemsPerPage = false;
	$scope.maxSize               = 10;
	$scope.columns               = $scope.columnsAluno;

	$scope.$watch('alunoFilter', function(newValue){
		if(newValue){
			localStorage.setItem('wsAlunoFilter', JSON.stringify(newValue));	
		}
	}, true);

	$scope.carregaAluno = function(){
		var alunoFilter = localStorage.getItem('wsAlunoFilter') ? JSON.parse(localStorage.getItem('wsAlunoFilter')) : {};
		$scope.alunoFilter = alunoFilter;

		AlunoResource.get({}, function(response){
			$scope.alunoDataset = response.data;
		});
	};

	$scope.carregaCadAluno = function(){
		AlunoResource.get({id_aluno : $routeParams.aluno}, function(response){
			if(!angular.isArray(response.data)){
				$scope.cadAlunoDataset = response.data;
			}
		});
	};

	$scope.salvaAluno = function(){
		var aluno = $scope.cadAlunoDataset;
		data_nasc = aluno.data_nasc;
		if (data_nasc instanceof Date) {
			data_nasc = data_nasc.getFullYear() + "-" + ("00"+(data_nasc.getMonth()+1)).substr(-2) + "-" + data_nasc.getDate();
		}

		aluno.data_nasc = data_nasc;
		AlunoResource.save(aluno, function(response){
			$location.path('/cad_aluno/'+response.data.id_aluno);
		});
	};

	$scope.cancelaEdicaoAluno = function(){
		$location.path('/aluno');
	};

	$scope.deletaAluno = function(aluno){
		if(confirm('Realmente deseja apagar?')){
			AlunoResource.remove({id_aluno : aluno.id_aluno}, function(){
				$scope.carregaAluno();
			});
		}
	};

	$scope.consultaCep = function(){
		var cep = $scope.cadAlunoDataset.cep.replace('-','');
		ConsultaCepResource.get({cep:cep}, function(response){
			$scope.cadAlunoDataset['bairro'] = response.bairro;
			$scope.cadAlunoDataset['uf'] = response.uf;
			$scope.cadAlunoDataset['cidade'] = response.localidade;
			$scope.cadAlunoDataset['logradouro'] = response.logradouro;
		});
	};

}]);

AppControllers.controller('ContratoController', ['$scope', 'ContratoResource', '$location', '$routeParams', '$timeout', function ($scope, ContratoResource, $location, $routeParams, $timeout) {
	$scope.aluno = $routeParams.aluno;
	$scope.contratoDataset = null;
	$scope.cadContratoDataset = null;

	$scope.carregaContrato = function(){
		ContratoResource.get({id_aluno : $routeParams.aluno}, function(response){
			$scope.contratoDataset = response.data.contrato;
		});
	};

	$scope.carregaCadContrato = function(){
		var aluno = $routeParams.aluno;
		ContratoResource.get({id_aluno : $routeParams.aluno, id_contrato : $routeParams.contrato}, function(response){
			$scope.selectPlano = response.data.selectPlano;
			$scope.selectDesconto = response.data.selectDesconto;
			$scope.selectFormaPagamento = response.data.selectFormaPagamento;
			$timeout(function(){
				if(!angular.isArray(response.data.contrato)){
					$scope.cadContratoDataset = response.data.contrato;
				} else {
					$scope.cadContratoDataset = {'id_aluno' : aluno};	
				}	
			});
		});
	};

	$scope.salvaContrato = function(){
		var contrato = $scope.cadContratoDataset;
		contrato.id_aluno = $routeParams.aluno;
		if(contrato.data_fim_computada == undefined || contrato.dias_trancado === null){
			contrato.data_fim_computada = contrato.data_fim;
		}
		// data_fim_computada = contrato.data_fim_computada;
		// if (data_fim_computada instanceof Date) {
		//   data_fim_computada = data_fim_computada.getFullYear() + "-" + ("00"+(data_fim_computada.getMonth()+1)).substr(-2) + "-" + data_fim_computada.getDate();
		// }

		// contrato.data_fim_computada = data_fim_computada;

		ContratoResource.save(contrato, function(response){
			$location.path('/contrato/'+contrato.id_aluno);
		});
	};

    function diasDecorridos(strDt1, dt2){
        // variáveis auxiliares
        var minuto = 60000;
        var dia = minuto * 60 * 24;
        var horarioVerao = 0;
        var dt1 = new Date (strDt1.split("-").join());

        // ajusta o horario de cada objeto Date
        dt1.setHours(0);
        dt1.setMinutes(0);
        dt1.setSeconds(0);
        dt2.setHours(0);
        dt2.setMinutes(0);
        dt2.setSeconds(0);

        // determina o fuso horário de cada objeto Date
        var fh1 = dt1.getTimezoneOffset();
        var fh2 = dt2.getTimezoneOffset();

        // retira a diferença do horário de verão
        if(dt2 > dt1){
            horarioVerao = (fh2 - fh1) * minuto;
        }
        else{
            horarioVerao = (fh1 - fh2) * minuto;
        }

        var dif = Math.abs(dt2.getTime() - dt1.getTime()) - horarioVerao;
        return Math.ceil(dif / dia);
    }
	$scope.atualizaVencimentoContrato = function(){
		var contrato = $scope.cadContratoDataset,
		dtFimComputada = new Date (contrato.data_fim_computada.split("-").join()),
		qtdDiasTrancados = contrato.dias_trancado,
		month = [],
		dtFimAtual = new Date(contrato.data_fim_computada.split("-").join());

        if(qtdDiasTrancados === ""){
            qtdDiasTrancados = 0;
        }
        if(qtdDiasTrancados === undefined || qtdDiasTrancados === null){
            qtdDiasTrancados = diasDecorridos(contrato.data_fim_computada,dtFimAtual);
        }

		month[0]= "01";
		month[1]= "02";
		month[2]= "03";
		month[3]= "04";
		month[4]= "05";
		month[5]= "06";
		month[6]= "07";
		month[7]= "08";
		month[8]= "09";
		month[9]= "10";
		month[10]="11";
		month[11]= "12";

		dtFimAtual.setDate(dtFimComputada.getDate()+parseInt(qtdDiasTrancados));
		var ano = dtFimAtual.getFullYear(),
		mes = month[dtFimAtual.getMonth()],				
		dia = dtFimAtual.getDate().toString();
		if(dia.length == 1) dia = "0"+dia;
		contrato.data_fim = ano+"-"+mes+"-"+dia;
	}

	$scope.cancelaEdicaoContrato = function(){
		var contrato = $scope.cadContratoDataset;
		$location.path('/contrato/'+contrato.id_aluno);
	};

	$scope.deletaContrato = function(contrato){
		if(confirm('Realmente deseja apagar?')){
			ContratoResource.remove({id_aluno : contrato.id_aluno, id_contrato : contrato.id_contrato}, function(){
				$scope.carregaContrato();
			});
		}
	};

}]);

AppControllers.controller('ServicoController', ['$scope','$routeParams', '$location', 'ServicoResource', '$timeout', function ($scope, $routeParams, $location, ServicoResource, $timeout) {
	$scope.servicoDataset = null;
	$scope.selectAluno = null;

	$scope.carregaServico = function(){
		ServicoResource.get({}, function(response){
			$scope.servicoDataset = response.data.servico;
		});
	};

	$scope.carregaCadServico = function(){
		ServicoResource.get({id_servico: $routeParams.servico}, function(response){
			$scope.selectAluno = response.data.selectAluno;	
			$timeout(function(){
				if(!angular.isArray(response.data.servico)){
					$scope.servicoDataset = response.data.servico;	
				}
			});
		});
	};

	$scope.salvaServico = function(){
		var servico = $scope.servicoDataset;

		data = servico.data;

		if (data instanceof Date) {
			data = data.getFullYear() + "-" + ("00"+(data.getMonth()+1)).substr(-2) + "-" + data.getDate();
		}

		servico.data = data;
		
		ServicoResource.save(servico, function(response){
			$location.path('/servico');
		});
	};

	$scope.cancelaEdicaoServico = function(){
		$location.path('/servico');
	};

	$scope.deletaServico = function(servico){
		if(confirm('Realmente deseja apagar?')){
			ServicoResource.remove({id_servico : servico.id_servico}, function(response){
				$scope.carregaServico();
			});
		}
	};
}]);

AppControllers.controller('PresencaController', ['$scope','$routeParams', '$location', '$modal', 'PresencaResource', 'AlunoResource', function ($scope, $routeParams, $location, $modal, PresencaResource, AlunoResource) {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth()<9?"0"+(today.getMonth()+1):today.getMonth()+1;
	var day = (today.getDate()<10?'0':'') + today.getDate();
	$scope.pesquisaAulaDataset = {data:year+'-'+month+'-'+day};
	$scope.aulaDataset = null;
	$scope.cadPesquisaAluno = null;
	$scope.cadAlunoDataset = null;
	$scope.cadPresencaDataset = {data:year+'-'+month+'-'+day, presentes : new Array()};

	$scope.pesquisaAulas = function(){
		var pesquisaAulaDataset = $scope.pesquisaAulaDataset;
		PresencaResource.get(pesquisaAulaDataset, function(response){
			$scope.aulaDataset = response.data;
		});
	};

	$scope.carregaCadPresenca = function(){
		PresencaResource.get({id_aula: $routeParams.aula}, function(response){	
			if(!angular.isArray(response.data)){
				$scope.cadPresencaDataset = response.data.aula;	
				$scope.cadPresencaDataset.presentes = response.data.presenca;
			}
		});
	};

	$scope.presquisaAluno = function(){
		AlunoResource.get($scope.cadPesquisaAluno, function(response){
			$scope.cadAlunoDataset = response.data;
		});
	};

	$scope.adicionaAlunoPresente = function(aluno){
		var jaPresente = $scope.cadPresencaDataset.presentes.filter(function(item){
			if(item.id_aluno === aluno.id_aluno){
				return true
			}
			return false;
		});

		if(jaPresente.length === 0){
			aluno.senha = $scope.cadPresencaDataset.presentes.length+1;
			$scope.cadPresencaDataset.presentes.push(aluno);
		}
	};

	$scope.removeAlunoPresente = function(aluno){
		var index = $scope.cadPresencaDataset.presentes.indexOf(aluno);
		$scope.cadPresencaDataset.presentes.splice(index,1);

		$scope.cadPresencaDataset.presentes.forEach(function(item, key){
			item.senha = key+1;
		});
	};

	$scope.salvaPresenca = function(){
		var presenca = $scope.cadPresencaDataset;
		PresencaResource.save(presenca, function(response){
			$location.path('/presenca');
		});
	};

	$scope.cancelaEdicaoPresenca = function(){
		$location.path('/presenca');
	};

	$scope.deletaPresenca = function(presenca){
		if(confirm('Realmente deseja apagar?')){
			PresencaResource.remove({id_aula : presenca.id_aula}, function(response){
				$scope.pesquisaAulas();
			});
		}
	};

	$scope.modalObservacaoAluno = function(aluno){
		var modalInstance = $modal.open({
			templateUrl: "views/partials/ws_modal.html",
			controller: 'ModalController',
			backdrop: true, // removendo o backdrop porque ainda falta definir uma maneira de adicionar os templates do angular-ui-bootstrap
			resolve: {
				items: function(){
					return {
						title: 'Observações do aluno',
						text: aluno.observacao_presenca
					}				
				}
			}
		});
	};
}]);


AppControllers.controller('RelMetricaContratoController', ['$scope', 'RelMetricaContratoResource',function ($scope, RelMetricaContratoResource) {
	$scope.relMetricaContratoDataset = null;
	$scope.relMetricaContratoResponseDataset = null;
	$scope.alunosMetricaSelecionada = null;

	$scope.currentPage           = 1;
	$scope.itemsPerPage          = 10;
	$scope.showInputItemsPerPage = false;
	$scope.maxSize               = 10;

	$scope.pesquisaRelMetricaContrato = function(){
		$scope.currentPage = 1;
		var pesquisa = $scope.relMetricaContratoDataset;
		RelMetricaContratoResource.pesquisa(pesquisa,function(response){
			$scope.relMetricaContratoResponseDataset = [response.data];
			$scope.alunosMetricaSelecionada = null;
		});	
	};

	$scope.buscaAlunosPorStatus = function(tipo){
		$scope.currentPage = 1;
		switch(tipo){
			case 'P':
			$scope.alunosMetricaSelecionada = $scope.relMetricaContratoResponseDataset[0].ativoPeriodo;
			break;
			case 'F':
			$scope.alunosMetricaSelecionada = $scope.relMetricaContratoResponseDataset[0].finalizado;
			break;
			case 'R':
			$scope.alunosMetricaSelecionada = $scope.relMetricaContratoResponseDataset[0].renovado;
			break;
			case 'N':
			$scope.alunosMetricaSelecionada = $scope.relMetricaContratoResponseDataset[0].novos;
			break;
			case 'A':
			$scope.alunosMetricaSelecionada = $scope.relMetricaContratoResponseDataset[0].ativos;
			break;
			case 'default':
			$scope.alunosMetricaSelecionada = null;
			break;
		}
	};
}]);

AppControllers.controller('RelPresencaController', ['$scope', 'RelPresencaResource',function ($scope, RelPresencaResource) {
	$scope.relPresencaDataset = null;
	$scope.relPresencaResponseDataset = null;
	$scope.alunosPresencaSelecionada = null;

	$scope.currentPage           = 1;
	$scope.itemsPerPage          = 10;
	$scope.showInputItemsPerPage = false;
	$scope.maxSize               = 10;

	$scope.pesquisaRelPresenca = function(){
		$scope.currentPage = 1;
		var pesquisa = $scope.relPresencaDataset;
		RelPresencaResource.pesquisa(pesquisa,function(response){
			$scope.relPresencaResponseDataset = response.data;
			$scope.alunosPresencaSelecionada = null;
		});	
	};

	$scope.buscaAlunosPorPresenca = function(tipo){
		$scope.currentPage = 1;
		switch(tipo){
			case 'P':
			$scope.alunosPresencaSelecionada = $scope.relPresencaResponseDataset.presentes;
			break;
			case 'A':
			$scope.alunosPresencaSelecionada = $scope.relPresencaResponseDataset.ausentes;
			break;
			case 'default':
			$scope.alunosPresencaSelecionada = null;
			break;
		}
	};
}]);

AppControllers.controller('RelAulaController', ['$scope', 'RelAulaResource', function ($scope, RelAulaResource) {
	$scope.relaulaDataset = null;
	$scope.relAulaResponseDataset = null;
	$scope.chart = null;
	
	$scope.pesquisaRelAula = function(){
		$('#bar-chart svg, .morris-hover').remove();
		var pesquisa = $scope.relaulaDataset;
		RelAulaResource.pesquisa(pesquisa,function(response){
			$scope.relAulaResponseDataset = response.data;
			$scope.loadChart();
		});	
	};

	$scope.loadChart = function(){
		var dataValues = $scope.processData("num_presentes");
		var dataValuesExc = $scope.processData("excedente");
		var labelValues = $scope.processLabel("data");
		var lineChartData = {
			element: 'bar-chart',
			data: $scope.relAulaResponseDataset,
			xkey: 'data',
			ykeys: ['num_presentes', 'excedente'],
			labels: ['Presentes', 'Excedentes'],
			barColors: ['#444','#e5412d'],
			stacked: true
		}
		$scope.chart = new Morris.Bar(lineChartData);
	};
	$scope.processData = function(key){
		var values = new Array();
		angular.forEach($scope.relAulaResponseDataset, function(item){
			values.push(parseInt(item[key]));
		});
		return values;
	};
	$scope.processLabel = function(key){
		var values = new Array();
		angular.forEach($scope.relAulaResponseDataset, function(item){
			values.push(item[key]);
		});
		return values;	
	}
}]);

AppControllers.controller('RelServicoController', ['$scope', 'RelServicoResource', function ($scope, RelServicoResource) {
	$scope.relservicoDataset = null;
	$scope.relServicoResponseDataset = null;
	$scope.chart = null;
	
	$scope.pesquisaRelServico = function(){
		$('#bar-chart svg, .morris-hover').remove();
		var pesquisa = $scope.relservicoDataset;
		RelServicoResource.pesquisa(pesquisa,function(response){
			$scope.relServicoResponseDataset = response.data;
			$scope.loadChart();
		});	
	};

	$scope.loadChart = function(){
		var dataValues = $scope.processData("valor");
		var labelValues = $scope.processLabel("data");
		var lineChartData = {
			element: 'bar-chart',
			data: $scope.relServicoResponseDataset,
			xkey: 'data',
			ykeys: ['valor'],
			labels: ['Valor'],
			barColors: ['#444','#e5412d'],
			stacked: true
		}
		$scope.chart = new Morris.Bar(lineChartData);
	};
	$scope.processData = function(key){
		var values = new Array();
		angular.forEach($scope.relServicoResponseDataset, function(item){
			values.push(item[key]);
		});
		return values;
	};
	$scope.processLabel = function(key){
		var values = new Array();
		angular.forEach($scope.relServicoResponseDataset, function(item){
			values.push(item[key]);
		});
		return values;	
	}
}]);

AppControllers.controller('PerfilController', ['$scope', '$routeParams', '$rootScope','$location', 'frce', 'MessageService', function ($scope, $routeParams, $rootScope, $location, PerfilResource, MessageService) {
	$scope.perfilDataset = null;

	$scope.carregaPerfil = function(){
		PerfilResource.get({}, function(response){
			$scope.perfilDataset = response.data;
		});
	};

	$scope.salvaPerfil = function(){
		var perfil = $scope.perfilDataset;
		PerfilResource.save(perfil, function(response){
			if(response){
				$rootScope.loggedUserData = response.data;
			}

			$location.path('/perfil');	
			MessageService.processMessages(new Array({type: 'success', title:'Atualização concluida', message:"Alteração de perfil concluida."}));
		});
	};

	$scope.atualizaSenha = function(){
		var perfil = $scope.perfilDataset;

		if(perfil.senhaAtual){
			if(perfil.novaSenha != perfil.confirmaSenha){
				MessageService.processMessages(new Array({type: 'danger', title:'Erro ao alterar senha!', message:"Nova senha e sua confirmação devem possuir o mesmo valor."}))
			} else {
				PerfilResource.atualizaSenha(perfil, function(){
					$location.path('/perfil');	
					MessageService.processMessages(new Array({type: 'success', title:'Atualização concluida', message:"Alteração de senha concluida."}));
				});
			}
		}	
	};

	$scope.cancelaPerfil = function(){
		$location.path('/perfil');
	};
}]);

AppControllers.controller('CadastroUsuarioController', ['$scope', '$location', '$routeParams', 'UsuarioResource', function($scope, $location, $routeParams, UsuarioResource) {
	$scope.usuarioFilter = {}
	$scope.currentPage   = 1;
	$scope.itemsPerPage  = 10;

	$scope.cancelaEdicaoUsuario = function() {
		$location.path("/usuario");
	};

	$scope.salvarUsuario = function() {
		UsuarioResource.save($scope.usuario, function(response){
			$location.path('/usuario');
		});
	};

	$scope.carregaCadUsuario = function() {
		UsuarioResource.get({id_usuario : $routeParams.usuario}, function(response){
			if(!angular.isArray(response.data)){
				$scope.usuario = response.data;
			}
		});
	};

	$scope.deletaUsuario = function(usuario) {
		if(confirm('Realmente deseja apagar?')){
			UsuarioResource.remove({id_usuario : usuario.id_usuario}, function(){
				$scope.carregaUsuarios();
			});
		}
	}

	$scope.carregaUsuarios = function() {
		UsuarioResource.get(function(result) {
			$scope.usuarios = result.data;
		});
	}
}]);

AppControllers.controller('FinanceiroController', ['$scope','$routeParams', '$location', 'FinanceiroResource', '$timeout', '$modal', 'AgrupadorResource', function ($scope, $routeParams, $location, FinanceiroResource, $timeout, $modal, AgrupadorResource) {
	$scope.financeiroDataset = null;
	$scope.financeiroFiltrado = null;
	$scope.cadFinanceiroDataset = null;
	$scope.listaCategorias = null;
	$scope.listaAnos = null;

	var now = new Date();
	$scope.filtroFinanceiro = {
		ano: now.getFullYear(),
		mes: null
	};
	
	$scope.carregaFinanceiro = function(){
		FinanceiroResource.get({ano: $scope.filtroFinanceiro.ano}, function(response){
			$scope.financeiroDataset = response.data.dadosFinanceiro;
			$scope.financeiroFiltrado = response.data.dadosFinanceiro;
			$scope.listaCategorias = response.data.categorias;
			$scope.listaAnos = response.data.anos;
			$scope.filtrarMes(now.getMonth() + 1);
		});
	};

	$scope.filtrarAno = function(ano){
		$scope.filtroFinanceiro.ano = ano;
		$scope.carregaFinanceiro();
	};

	$scope.filtrarMes = function(mes){
		$scope.filtroFinanceiro.mes = mes;
		$scope.financeiroFiltrado = $scope.financeiroDataset.filter(function(item){
			var data = new Date(item.data + " 00:00:00");
			return (data.getMonth() + 1) == mes;
		});
	};

	$scope.carregaCadFinMovimento = function(){
		var id_financeiro = $routeParams.financeiro;
		FinanceiroResource.get({id_financeiro: id_financeiro}, function(response){
			$scope.listaCategorias = response.data.categorias;
			$timeout(function(){
				if(!angular.isArray(response.data.dadosFinanceiro)) {
					$scope.cadFinanceiroDataset = response.data.dadosFinanceiro;	
				}	
			});
		});
	};

	$scope.salvaFinMovimento = function(){
		var movimento = $scope.cadFinanceiroDataset;
		FinanceiroResource.save(movimento, function(response){
			$location.path('/financeiro');
		});	
	};

	$scope.cancelaEdicaoMovimento = function(){
		$location.path('/financeiro');
	};

	$scope.removeFinMovimento = function(movimento){
		if(confirm('Realmente deseja apagar?')){
			FinanceiroResource.remove({id_financeiro : movimento.id_financeiro}, function(response){
				$scope.carregaFinanceiro();
			});
		}
	};

	$scope.entradasPeriodo = function(dataset){
		if(!dataset) return 0;
		var entradas = dataset.filter(function(item){
			return item.tipo == 'R';
		});

		var valorTotal = 0;
		angular.forEach(entradas, function(entrada){
			valorTotal = parseFloat(valorTotal) + parseFloat(entrada.valor);
		});
		return valorTotal;
	};

	$scope.saidasPeriodo = function(dataset){
		if(!dataset) return 0;
		var saidas = dataset.filter(function(item){
			return item.tipo == 'D';
		});

		var valorTotal = 0;
		angular.forEach(saidas, function(saida){
			valorTotal = parseFloat(valorTotal) + parseFloat(saida.valor);
		});
		return valorTotal;
	};

	$scope.resultadoPeriodo = function(dataset){
		var valorTotal = 0;
		angular.forEach(dataset, function(financeiro){
			if(financeiro.tipo == 'R') {
				valorTotal = parseFloat(valorTotal) + parseFloat(financeiro.valor);
			} else {
				valorTotal = parseFloat(valorTotal) - parseFloat(financeiro.valor);
			}
			
		});
		return valorTotal;
	};

	$scope.modalNovoAgrupador = function(){
		var modalInstance = $modal.open({
			templateUrl: "views/partials/ws_modal_agrupador_financeiro.html",
			controller: 'ModalAgrupadorController',
			backdrop: true, // removendo o backdrop porque ainda falta definir uma maneira de adicionar os templates do angular-ui-bootstrap
			resolve: {
				items: function(){
					return {
						
					}				
				}
			}
		});

		modalInstance.result.then(function(){
			AgrupadorResource.get({}, function(response){
				$scope.listaCategorias = response.data.categorias;
			});
		});
	};
}]);

AppControllers.controller('RelatorioController', ['$scope', '$rootScope', 'DashboardResource', function ($scope, $rootScope, DashboardResource) {
	$rootScope.sideBarIsVisible = false;
	$rootScope.headerIsVisible  = false;

	$scope.loadRelAniversariantes = function(){
		DashboardResource.relAniversariantes({}, function(response){
			$scope.relatorio = response.data.relatorio;
			window.print();
		});
	};
}]);

AppControllers.controller('ModalController', ['$scope', '$modalInstance','items', function ($scope, $modalInstance, items) {
	$scope.modalDataset = items;

	$scope.ok = function () {
		$modalInstance.close();
	};

}]);

AppControllers.controller('ModalAgrupadorController', ['$scope', '$modalInstance','items', 'AgrupadorResource', function ($scope, $modalInstance, items, AgrupadorResource) {
	$scope.agrupadorDataset = {nome:null};

	$scope.salvaAgrupador = function(){
		var agrupadorDataset = $scope.agrupadorDataset;
		if(agrupadorDataset.nome) {
			AgrupadorResource.save(agrupadorDataset, function(response){
				$modalInstance.close();	
			});	
		}
	};

	$scope.ok = function () {
		$modalInstance.close();
	};

}]);
