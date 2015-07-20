/******* CABRA SMALLTALK *******/


(function(){
    
    var objectPrimitive = { };
    
    // описание классов
    
    var cabraClasses = {
        ProtoObject: {
            subclass: null,
            variables: function(){return {}},
            methods: {
                
            }
        },
        Object: {
            subclass: "ProtoObject",
            variables: function(){return {}},
            methods: {
            }
        },
        Boolean: {
            subclass: "Object",
            variables: function(){return {}},
            methods: {
                
            },
        },
        Nil: {
            variables: function(){return {}},
            methods: {
            }
        },
        True: {
            subclass: "Boolean",
            variables: function(){ },
            methods:{
            }
        },
        False: {
            subclass: "Boolean",
            variables: function(){},
            methods:{
            }
        },
                        // описание класса Number
        Number: {
            subclass: "Object",
                        // функция создает переменные
            variables: function(){return {}},
                        // описание методов
            methods: {
                                // метод сложение
                "+": {
                                // функция конструктор возвращает локальные переменные
                        localVariables: function(){},
                                // массив сообщений, примитивы в виде функции
                        method: [                           
                                   function(context){
                                                    // выполненный метод записывает результат в контекст
                                        context.result = createNumber(context.object.jsNative + context.variableSpace.aNumber.value.jsNative);
                                        }]
                },
                        // метод минус
                "-": {
                        localVariables: function() { },
                        method: [function(context){
                                        context.result = createNumber(context.object.jsNative + context.variableSpace.aNumber.jsNative)
                                        }]
                },
                "*":{
                        localVariables: function(){},
                        method: [function(context){
                                context.result = createNumber(context.object.jsNative * context.varialbeSpace.anObject.jsNative)
                            }
                        ]
                },
                "/": {
                        localVariables: function(){},
                        method: [function(context){
                            context.result = createNumber(context.object.jsNative / context.variableSpace.anObject,jsNative)}]
                },
                decrement: {
                        localVariables: function() {},
                        method: [
                            function(context){
                                context.result = createNumber(context.variableSpace.self.value.jsNative - 1);
                            }
                        ]
                },
                increment: {
                        localVariables: function() {},
                        method: [
                            function(context){
                                context.result = createNumber(context.variableSpace.self.value.jsNative + 1)
                            }
                        ]
                },
                "timesRepeat:": {
                        localVariables: function(){},
                        method: [
                                   
                                   // примитив сохранения числа в count контекста
                                   //function(context){context.count = context.variableSpace.self.value.jsNative},
                                    saveNumberToContext,
                                    
                                   // примитив метки рестарта
                                   function(context){lable(context)},
                                   
                                   // aBlock value
                                   ["aBlock", "value", {}],
                                   
                                   // примитив уменьшения count в контексте
                                   function(context){context.count --},
                                   
                                   // примитив рестарта метода если count = 0
                                   function(context) {restartMethod(context, context.count > 0)},
                                   
                                   // ^ self
                                   function(context){ returnResult(context, "recentResult") }
                                   ]
                },
                "to:do:": {
                        localVariables: function(){this.i = {value: nil}},
                        method: [
                                function(context){letVariable("i", "self",context)},
                                function(context){lable(context)},
                                function(context){
                                    var a,b;
                                    a = context.variableSpace.i.value.jsNative;
                                    b = context.variableSpace.aNumber.value.jsNative;
                                    if (a > b) {returnResult(context, "self");}
                                },
                                ["aBlock", "value", {}],
                                ["i", "increment", {}],
                                function(context){letVariable("i", "recentResult", context)},
                                function(context){
                                    var a,b;
                                    a = context.variableSpace.i.value.jsNative;
                                    b = context.variableSpace.aNumber.value.jsNative;
                                    if (a < b) {restartMethod(context, true);} },
                                function(context){returnResult(context, "self")}
                        ]
                }
            }
        },
        Block: {
            subclass: "Object",
            variables: function(){return{}},
            methods: {
                value: {
                    localVariables: function(){},
                    method: [function(context){returnResult(context, "self")}]
                }
            }
        },
        Process: {
            subclass: "Object",
            variables: function(){return{}},
            methods: {}
        },
        Collection: {
            subclass: "Object",
            variables: function(){return {}},
            methods: {},
        },
        String: {
            subclass: "Collection",
            variables: function(){return{}},
            methods: {}
        },
        Array: {
            subclass: "Collection",
            variables: function(){return{}},
            methods: {}
        },
        OrderedCollection: {
            subclass: "Collection",
            variables: function(){return{}},
            methods: {}
        },
        Dictionary: {
            subclass: "Collection",
            variables: function(){return{}},
            methods: {}
        }
    };
    
    /******* примитивы *******/
                    //сохрание в контексте текущего индекса сообщения
    var lable = function(context){
        context.lable = context.index    
    };
    
                    //рестарт метода в точку созданной функцией lable(context)
    var restartMethod = function(context, aJsBoolean){
        if(aJsBoolean){context.index = context.lable}     
    };
    
                    //возвращение результа сообщения (блок просто завершается)
    var returnResult = function(context, aVariableName){
        context.result = context.variableSpace[aVariableName].value
    };
    
                    //присваивание переменных
    var letVariable = function(receiverName, srcName, context){
        context.variableSpace[receiverName].value = context.variableSpace[srcName].value
    };
    
                    // примитив сохранения числа в count контекста
    var saveNumberToContext = function(context){
        context.count = context.variableSpace.self.value.jsNative
    };
    
    //счетчики
    
                    //всего созданно сообщений
    var messageCount = 0;
                    //всего созданно объектов
    var objectCount = 0;
    
    
    
    
    
    
    /******* Виртуальная машиша ********/
    
                    // функция добавления суперклассов
    var assignSubclasses = function(someClasses){
        var clName, subClName, cl, mt;
        for (clName in someClasses){
            subClName = someClasses[clName].subclass;
            if (subClName != null){
                someClasses[clName].methods.__proto__ = someClasses[subClName].methods
            }
        }
    };
    
    
    
    assignSubclasses(cabraClasses);
    
    
    
                    // функция конструктор создание объекта
    var createObject = function(aClassName){
        objectCount ++;
        var constructor = cabraClasses[aClassName];
        this.variables = constructor.variables();
        this.methods = constructor.methods;
        this.jsNative = null;
        this.context = null;
    };
    
    
    
                    // функция создания числа
    var createNumber = function(aNumber){
                    // создать объект класса Number
        var n = new createObject("Number");        
                    // запись в контейнер jsNative js-числа
        n.jsNative = aNumber;
        return n;
    };
    
    
                    // объект nil
    var nil = new createObject("Nil");
    
    
    
                    // функция создания блока
    var createBlock = function(context, messages) {
        var bl = new createObject("Block");
        bl.context = context;
        bl.methods = {
            __proto__: bl.methods,
            value: {
                localVariables: function(){},
                method: messages
            }
        };
        return bl;
    };
    
    
    
                    // создать пространство имен на основе объекта, локальных переменных метода и аргументов сообщения
                    // в качестве прототипа выступают переменные объекта, а локальные переменные и аргументы в основном
                    // для записи в пер. объекта они упакованы в контейнеры {value: значение}, прототип доступен только для чтения
    var createVariableSpace = function(objName, selector, args, extVariableSpace){
                    // obj - cabraObject, selector - селектор сообщения, args - аргументы сообщения в виде {anArg1: value, anArg2: value}
        var arg, v, vs, obj, self;
        
                    // ссылка на переменные объекта или пространство имен для блока
        obj = extVariableSpace[objName].value;
        vs = new obj.methods[selector].localVariables;
        
        if (obj.context == null) {
                v = obj.variables;
                vs.self = {value: obj};
        } else {
            v = obj.context.variableSpace;
            vs.self = obj.context.variableSpace.self};
        
                    // добавление аргументов к пространству имен
        for (arg in args) { vs[arg] = extVariableSpace[args[arg]] };

        vs.recentResult = {value: nil};
        Object.setPrototypeOf(vs, v);

        return vs;
    };
    
    
                    //создание контекста
                    // аргументы obj - получатель сообщения, selector - имя метода, args - аргументы сообщения
    var createContext = function(objectName, selector, args, extVariableSpace){
        this.object = extVariableSpace[objectName].value;
                    //ссылка на объект
        this.objectName = objectName;
                    //создание пространства имен метода (переменные объекта, локальные и аргументы)
        this.variableSpace = createVariableSpace(objectName, selector, args, extVariableSpace);
                    // индекс исполняемого сообщения в методе
        this.index = 0;
                    //имя метода
        this.selector = selector;
                    // аргументы
        this.args = args;
                    // сюда примитив записывает результат сообщения
        this.result = null;
                    // сюда записывается новый контекст следующего сообщения
                    // процесс сможет узнать завершен метод или продолжает углюбляться раскручивая сообщения
        this.innerContext = null;
        };
        
        
                    // шаг сообщения
                    // если сообщение требует вложенных сообщений, в контекст записывается следующий контекст
                    // если метод выполнен в контекст возвращается результат
    var stepMsg = function(context){
                    //получение сообщения или примитива
        var msg = context.object.methods[context.selector].method[context.index]; //2.5%
        if (typeof msg == "function"){
                        //если примитив то выполняется
            msg(context);
                    // иначе создается новый контекст сообщения   
        } else {
            context.innerContext = new createContext(msg[0], msg[1], msg[2], context.variableSpace); //30%
            
        };
                    //индекс на новое сообщение
        context.index ++;
    };
    
    
    
    // функция конструктор Cabra процесса
    var createCabraProcess = function(context){
                    //стек сообщений
        this.contexts = [ context ];
                    //текущей контекст сообщения
        this.index = 0;
        this.result = null;
        this.previousContext = null;
    };
    
    
    
    // функция выполения шага процесса
    var stepCabraProcess = function(cabraProcess){
                    //получение текущего контекста сообщения
        var currentContext = cabraProcess.contexts[cabraProcess.index];
                    //выполнить шаг сообщения
        stepMsg(currentContext);

        if (currentContext.result == null){
            if(currentContext.innerContext == null){return null };
                    //погружение в стек
            cabraProcess.contexts[cabraProcess.index + 1 ] = currentContext.innerContext;
            cabraProcess.index ++;
            messageCount ++;
        } else {
                    //сообщение вернуло результат
                    // если индекс стека равен 1 завершение процесса
            if (cabraProcess.index == 0) {
                cabraProcess.result = currentContext.result;
            } else {
                        //сжимание стека и запись результата в вышестоящий контекст
                cabraProcess.previousContext = cabraProcess.contexts[cabraProcess.index - 1];
                cabraProcess.previousContext.variableSpace.recentResult.value = currentContext.result;  //1%                
                cabraProcess.previousContext.innerContext = null;
                        //обнуление контекста выполненого сообщения
                cabraProcess.contexts[cabraProcess.index] = null;
                        //уменьшение индекса
                cabraProcess.index --;
            }
        }
    };
    
    
    
    // функция выполнения процесса
    // возвращает результат сообщения
    var runProcess = function(context){
        var pr = new createCabraProcess(context);
        while(pr.result == null){
            stepCabraProcess(pr);
        };
        return pr.result;
    };
    
    
    
    
    
    /******* workspace *******/
    
    var n = createNumber(100000);
    var n2 = createNumber(500000);
    var count = createNumber(1);
    
    console.log("run cabra process");
    
                // для блока обязательно наличние контекста со свойством variableSpace
    var blockContext = {variableSpace:{number:{value: n2}}};
    
                //создание блока
    var block = createBlock(blockContext, [
        ["number", "+", {aNumber: "number"} ],      // number + aNumber. "результат сохраняется в recentResult"
        ["number", "decrement", {} ],               // number decrement.
        ["recentResult", "decrement", {} ],         // recentResult decrement.
        ["recentResult", "decrement", {} ],         // recentResult decrement.
        ["recentResult", "decrement", {} ],         // recentResult decrement.
        ["recentResult", "decrement", {} ],         // recentResult decrement.
        ["recentResult", "decrement", {} ],         // recentResult decrement.
        function(context){letVariable("number", "recentResult", context)},      // n := recentResult.
        function(context){returnResult(context, "number")}                      // выход из блока но не из метода
    ]);
    
    // создается контекст сообщения start to: aNumber do: aBlock
    // сообщение содержит только имена переменных, значения присваиваются из пространства имен (4 аргумент)
    // третий аргумент функции содержит правила преобразования аргументов метода из пространства имен
    // aNumber получает значение из number
    // aBlock из block
    var context2 = new createContext("start", "to:do:", {aNumber: "number", aBlock: "aBlock"},
        {   "start": {value: count},
            "number": {value: n},
            "aBlock": { value: block }       
        }
    );
    var startDate = new Date();
    console.log(new Date());
    
    // запуск процесса из сообщения
    // процесс возвращает результат сообщения
    console.log(runProcess(context2));
    
    var duration = new Date() - startDate;
    console.log("Общее время: ", duration.toString() + " мсек");
    
    console.log("Создано объектов: " + objectCount.toString());
    console.log("Количество сообщений: " + messageCount.toString());
    console.log("Сообщений в секунду: " + (messageCount / duration * 1000).toString());
    console.log("Создано объектов в секунду: " + (objectCount / duration * 1000).toString())
    alert( "Создано объектов: " + objectCount.toString() + "\nКоличество сообщений: " + messageCount.toString() + "\nСообщений в секунду: " + (messageCount / duration * 1000).toString() + "\nСоздано объектов в секунду: " + (objectCount / duration * 1000).toString() );
    
})()