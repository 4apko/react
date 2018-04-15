var my_news = [{
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение '
    }
];

window.ee = new EventEmitter();

var my_news2 = [];

var News = React.createClass({
    count: function(e) {
        e.preventDefault();
        this.setState({ counter: ++this.state.counter })
    },
    getInitialState: function() {
        return {
            counter: 0
        }
    },
    render: function() {
        var counter = this.state.counter,
            data = this.props.data,
            newsTemplate;

        if (data.length > 0) {
            newsTemplate = data.map(function(item, index) {
                return (<div key = { index } >
                    		<Article data = { item }/>
                    	</div>)
            })
        } else {
            newsTemplate = <div className = "no_news"> Нет новостей! </div>
        }

        return (<div className = "news" > { newsTemplate } 
        			<p className = { data.length > 0 ? '' : 'none' }> 
        			<a href="#"
        				onClick={this.count}>
        				Всего { counter } кликов!
        			</a>
        			</p> 
        		</div>);
    }
});

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function() {
        return {
            visible: false
        }
    },
    readmoreClick: function(e) {
        e.preventDefault();
        if (this.state.visible) {
            this.setState({ visible: false });
        } else {
            this.setState({ visible: true });
        }
    },
    render: function() {
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;
        return (<div className = 'article' >
		        	<p className = "news__author" > { author }: </p>
		        	<p className = "news__text" > { text } </p> 
		        	<a href="#" 
			        	onClick={this.readmoreClick} 
			        	className = {"news__more " + (visible ? "none" : "")}>Подробнее...
		        	</a>
		        	<p className = {"news__bigText " + (visible ? "" : "none")} > { bigText } </p>
		        	<a href="#" 
			        	onClick={this.readmoreClick} 
			        	className = {"news__hide " + (visible ? "" : "none")}>Скрыть...
		        	</a>
        		</div>)
    }
});

var Add = React.createClass({
	getInitialState : function() {
		return {
			authorEmpty : true,
			textEmpty : true,
			unchecked : true
		};
	},
	onFieldChange : function(name, e) {
		this.setState({[''+name] : !e.target.value.trim() > 0});
	},
	onCheck : function(e) {
		this.setState({unchecked : !e.target.checked});
	},
	add : function(e) {
		e.preventDefault();
		var author = ReactDOM.findDOMNode(this.refs.author).value,
			text = ReactDOM.findDOMNode(this.refs.text);
		var item = [{
			author: author,
			text: text.value,
			bigText: '...'
		}];
		window.ee.emit('News.add', item);
		text.value = '';
		this.setState({textEmpty : true});
	},
    render: function() {
    	var authorEmpty = this.state.authorEmpty,
    		textEmpty = this.state.textEmpty,
    		unchecked = this.state.unchecked
        return (
        	<form className='addForm'>
        		<p>Автор:  <input className='add__author' onChange={this.onFieldChange.bind(this, 'authorEmpty')} defaultValue = '' ref = 'author' /> </p>
            	<p>Текст: <textarea className='add__text' onChange={this.onFieldChange.bind(this, 'textEmpty')} ref='text' /></p>
        		<p><label className='add__check'><input type='checkbox' onChange={this.onCheck} ref='check' />Я согласен с правилами </label></p>
        		<button className='add__btn' ref="confirm" disabled = {authorEmpty || textEmpty || unchecked} onClick={this.add} >Добавить</button>
        	</form>
        )
    }
});


var App = React.createClass({
	getInitialState : function () {
		return {
			news : my_news
		};
	},
	componentDidMount : function () {
		var self = this;
		window.ee.addListener('News.add', function(item) {
			var nextNews = item.concat(self.state.news);
			self.setState({news: nextNews});
		});
	},
	componentWillUnmount : function () {
		window.ee.removeListener('News.add');
	},
    render: function() {
        return (
        	<div className='app'>
        	    <Add />
        		<h3 className = "app" > Новости! </h3>
        		<News data = { this.state.news } />  
        	</div>
        	);
    }
});

ReactDOM.render(<App />,
    document.getElementById('root')
);