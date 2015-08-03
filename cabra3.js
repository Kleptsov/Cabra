(function(){
    
    /******* описание классов *******/
    
            //таблица переменных и методов
    var stSymbols = {};
    
    var stSymbolIndex = 0;
    
    var stClasses = {};
    
    var getSymbolIndex = function(aSymbol) {
        if (aSymbol in stSymbols){
            return stSymbols[aSymbol]
        } else {
            stSymbolIndex ++;
            stSymbols[aSymbol] = stSymbolIndex;
            return stSymbolIndex;
        } 
    };
    
    var addClass = function(aClassName){
        getClassIndex(aClassName);
    };
    
    var getClassIndex = function(aSymbol){
        var index = getSymbolIndex(aSymbol);
        if (index in stClasses) {
            return index;
        } else {
            stClasses[index] = {
                className: aSymbol,
                superclass: "Object",
                category: "undefinded",
                instanceVariableNames: [],
                classVariableNames: [],
                classVariableObjects: [],
                metaclassInstanceNames: [],
                instanceMethods: {},
                compiledInstanceMethods: {},
                metaclassMethods: {},
                namespace: [],
                methodNamespace: [],
                configuration: []
            };
            return index;
        }
    };
    
    var numberClassIndex = getClassIndex("Number");
    
    var getClassDescription = function(aClassName){
        var index = getClassIndex(aClassName);
        return stClasses[index];
    };
    
    var superclassFor = function(aClassName, aSuperclassName){
        var classDescription = getClassDescription(aClassName);
        classDescription.superclass = aSuperclassName;
    };
    
    var instanceVariableNamesFor = function(aClassName, someVariables){
        var classDescription = getClassDescription(aClassName);
        classDescription["instanceVariableNames"] = someVariables;
    };
    
    var classVariableNamesFor = function(aClassName, someVariables){
        var classDescription = getClassDescription(aClassName);
        classDescription.classVariableNames = someVariables;
        classDescription.classVariableObjects = new Array(someVariables.length);
    };
    
    var getInstanceMethodDescription = function(aClassName){
        var classDescription = getClassDescription(aClassName);
        if (! ("instanceMethods" in classDescription)) {
            classDescription.instanceMethods = {}
        };
        return classDescription.instanceMethods;
    };
    
    var addInstanceMethodFor = function(aClassName, method){
        var methodDescription = getInstanceMethodDescription(aClassName);
        var methodIndex = getSymbolIndex(method[0][0]);
        methodDescription[methodIndex] = method;
    };
    
    var getMetaclassMethodDescription = function(aClassName){
        var classDescription = getClassDescription(aClassName);
        if (! ("metaclassMethods" in classDescription)) {
            classDescription.classMethods = {};
        };
        return classDescription.classMethods;
    };
    
    var addClassMethodFor = function(aClassName, method){
        var classMethodDescription = getMetaclassMethodDescription(aClassName);
        var methodIndex = getSymbolIndex(method[0][0]);
        classMethodDescription[methodIndex] = method;
    };
    
    var metaClassInstancesFor = function(aClassName, someInstances){
        var classDescription = getClassDescription(aClassName);
        classDescription.metaClassInstances = someInstances;
    };
    
    var getMetaclassMethodDescription = function(aClassName){
        var classDescription = getClassDescription(aClassName);
        if (! ("metaClassMethods" in classDescription)) {
            classDescription.metaclassMethods = {};
        };
        return classDescription.metaclassMethods;
    };
    
    var addMetaclassMethodFor = function(aClassName, method){
        var metaClassMethodDescription = getMetaclassMethodDescription(aClassName);
        var methodIndex = getSymbolIndex(method[0][0]);
        metaclassMethodDescription[methodIndex] = method;
    };
    
    
    
    /******* компиляция *******/
    
    var namespaceFor = function(aClassName){
        var classDescription = getClassDescription(aClassName);        
        classDescription.namespace = [ null, null, null, ["self", "recentResult"], [] ];
        classDescription.configuration = [ null, null, null, 2, null ];
        classDescription.methodNamespace = [];
        variablesForNamespace(aClassName, classDescription);
        classDescription.configuration[4] = classDescription.namespace[4].length;
        classVariablesForNamespace(aClassName, classDescription);
        instanceMethodsForNamespace(aClassName, classDescription);
    };
    
    var variablesForNamespace = function(aClassName, aClassDescription){
        var classDescription = getClassDescription(aClassName);
        var instanceVariableNames = classDescription.instanceVariableNames;
        concateVariables(aClassDescription.namespace[4], instanceVariableNames);
        if (classDescription.superclass != null){
            variablesForNamespace(classDescription.superclass, aClassDescription);
        }
    };
    
    var concateVariables = function(array1, array2){
        var size = array2.length;
        for (var i = 0; i < size; i ++){
            array1.push(array2[i]);
        };
    };
    
    var classVariablesForNamespace = function(aClassName, aClassDescription){
        var classDescription = getClassDescription(aClassName);
        var classVariableNames = classDescription.classVariableNames;
        if (classVariableNames.length > 0) {
            aClassDescription.namespace.push(classVariableNames);
            aClassDescription.configuration.push(classDescription.classVariableObjects);
        };
        if (classDescription.superclass != null) {
            classVariablesForNamespace(classDescription.superclass, aClassDescription);
        };
    };
    
    var objectLength = function(anObject){
        var count = 0;
        for (var key in anObject) count ++;
        return count;
    };
    
    var instanceMethodsForNamespace = function(aClassName, aClassDescription){
        var classDescription = getClassDescription(aClassName);
        if (objectLength(classDescription.instanceMethods) > 0) {
            aClassDescription.methodNamespace.push(classDescription.instanceMethods);
        };
        if (classDescription.superclass != null) {
            instanceMethodsForNamespace(classDescription.superclass, aClassDescription);
        };
    };
    
    var compileFor = function(aClassName){
        var classDescription = getClassDescription(aClassName);
        var namespace;
        var namespaceSize;
        classDescription.compiledInstanceMethods = {};
        namespaceFor(aClassName);
        namespace = classDescription.methodNamespace;
        namespaceSize = classDescription.methodNamespace.length;
        for (var i = (namespaceSize - 1); i >= 0; i -- ){
            for(var method in namespace[i]){
                classDescription.compiledInstanceMethods[method] = compileMethodFor(aClassName, namespace[i][method]);
            };
        };
    };
    
    var compileMethodFor = function(aClassName, aMethod){
        var classDescription = getClassDescription(aClassName);
        var methodSize = aMethod.length;
        var compiledMethod = [[aMethod[1].length, aMethod[2].length]];
        //подготовка пространства имен
        classDescription.namespace[1] = aMethod[1]; //аргументы сообщения подсоединяются к пространству имен
        classDescription.namespace[2] = aMethod[2]; //локальные переменные подсоединяются к пространству имен
        
        for(var i = 3; i < methodSize; i++ ){
            compiledMethod.push(compileMessage(classDescription.namespace, aMethod[i]));
        };
        return compiledMethod;
    };
    
    var compileMessage = function(aNamespace, aMessage){
        if (aMessage[0] == "primitive") {
            return compilePrimitive(aNamespace, aMessage);
        };
        var argumentCount = aMessage.length - 2;
        var compiledMessage = [];
        var address;
        compiledMessage[0] = argumentCount;     //количество аргументов
        address = getVariableAddress(aNamespace, aMessage[0]);
        compiledMessage[1] = address[0];   //получатель сообщения
        compiledMessage[2] = address[1];
        compiledMessage[3] = stSymbols[aMessage[1]];  //селектор
        for(var i = 2; i < (argumentCount + 2); i ++){
            address = getVariableAddress(aNamespace, aMessage[i]);
            compiledMessage.push(address[0]);
            compiledMessage.push(address[1]);
        };
        return compiledMessage;
    };
    
    var primitiveArg2Map = [false, true, false, false, false, false, true, true, true, true,];
    
    var compilePrimitive = function(aNamespace, aMessage){
        var address;
        var compiledMessage = [];
        compiledMessage[0] = -1;    //примитив
        compiledMessage[1] = aMessage[1];
        compiledMessage[2] = 0;
        compiledMessage[3] = 0;
        if (aMessage[1] == 4) {
            return compiledMessage; //примитив возврат результата не использует аргументы
        };
        address = getVariableAddress(aNamespace, aMessage[2]);
        compiledMessage[4] = address[0];    // первая переменная примитива
        compiledMessage[5] = address[1];
        if (aMessage[1] == 5) {              // для возврата переменной требуется только одна переменная
            return compiledMessage;
        };
        if (primitiveArg2Map[aMessage[1]]) {
            address = getVariableAddress(aNamespace, aMessage[3]);
            compiledMessage[6] = address[0];
            compiledMessage[7] = address[1];
            return compiledMessage;
        };
        compiledMessage[6] = aMessage[3];    //используется литерал (число или строка)
        compiledMessage[7] = 0;
        return compiledMessage;
    };
    
    var getVariableAddress = function(namespace, aVariableName){
        var namespaceSize = namespace.length;
        var segment;
        var segmentSize;
        var address = [null, null];
        for(var i = 1; i < namespaceSize; i ++ ){
            segment = namespace[i];
            segmentSize = segment.length;
            for(i2 = 0; i2 < segmentSize; i2 ++){
                if (segment[i2] == aVariableName){
                    address[0] = i;
                    address[1] = i2;
                }
            }
        }
        return address;
    };
  
    
    
    /******* создание объектов *******/
    
    var newObject = function(aClassIndex){
        var classDescription = stClasses[aClassIndex];
        var size = classDescription.namespace.length;
        var obj = new Array(size);
        var configuration = classDescription.configuration;
        obj[0] = classDescription.compiledInstanceMethods;
        obj[3] = [obj, null, null];
        obj[4] = new Array(configuration[4]);
        var el;
        //for (i = 5; i < size; i ++){
          //  el = configuration[i];
            //    obj[i] = el;
        //};
        classVariableSelector[size](obj, configuration);
        return obj;
    };
    
    var newNumber = function(aNumber){
        var obj = newObject(numberClassIndex);
        obj[3][2] = aNumber;
        return obj;
    };
    
    var classVariableSelector = [
        null, null, null, null, null, null,
        function(obj, configuration){obj[5] = configuration[5]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]; obj[7] = configuration[7]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]; obj[7] = configuration[7]; obj[8] = configuration [8]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]; obj[7] = configuration[7]; obj[8] = configuration [8]; obj[9] = configuration[9]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]; obj[7] = configuration[7]; obj[8] = configuration [8]; obj[9] = configuration[9]; obj[10] = configuration[10]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]; obj[7] = configuration[7]; obj[8] = configuration [8]; obj[9] = configuration[9]; obj[10] = configuration[10]; obj[11]= configuration[11]},
        function(obj, configuration){obj[5] = configuration[5]; obj[6] = configuration[6]; obj[7] = configuration[7]; obj[8] = configuration [8]; obj[9] = configuration[9]; obj[10] = configuration[10]; obj[11]= configuration[11]; obj[12] = configuration[12]}
    ];
    
    
    
    
    /******* определение классов *******/
    
    addClass("ProtoObject");
    superclassFor("ProtoObject", null);
    instanceVariableNamesFor("ProtoObject", ["x", "y", "z"]);
    classVariableNamesFor("ProtoObject", ["protov1", "protov2", "protov3"]);
    addInstanceMethodFor("ProtoObject",
        [
            ["method1", "test"],
            ["arg1", "arg2"],
            ["local1", "local2", "local3"],
            ["arg1", "method1", "arg1", "arg2"],
            ["arg2", "method1", "arg1", "arg2"],
            ["local1", "method1", "local2", "local3"]
        ]);
    addClass("Object");
    superclassFor("Object", "ProtoObject");
    instanceVariableNamesFor("Object", ["a", "b", "c"]);
    classVariableNamesFor("Object", ["cv1", "cv2", "cv3"]);
    addClass("Number");
    superclassFor("Number", "Object");
    instanceVariableNamesFor("Number", ["n1", "n2", "n3", "n4" ]);
    classVariableNamesFor("Number", ["cn1", "cn2", "cn3", "cn4"]);
    addInstanceMethodFor("Number",
        [
            ["numberMethod1", "test"],
            ["arg3", "arg4", "arg5"],
            ["l1", "l2", "l3", "l4"],
            ["l1", "method1", "l2", "l3"],
            ["l4", "numberMethod1", "arg3", "arg4", "l4"]
            /*["primitive", <primitiveNumber>, "arg1", "arg2" ... ]
            function(obj){}
            */
        ]
    );
    addInstanceMethodFor("Number",
    [
       ["testMethodArg:arg:", "test"],                  // testMethodArg: arg1 arg: arg2
       ["arg1", "arg2"],
       ["na1", "na2", "na3"],                           // |na1 na2 na3|
       ["primitive", 2, "na1", 99],                     // na1 := 99.
       ["primitive", 6, "na1", "na1"],                  // recentResult := na1 + na1.
       ["primitive", 8, "recentResult", "na1"],         // recentResult := recentResult * na1.
       ["primitive", 1, "protov1", "recentResult"],     // protov1 := recentResult. "protov1 переменная класса"
       ["protov1", "/", "protov1"],                         // recentResult := protov1 / na1.
       ["primitive", 4]                                 // ^ protov1
    ]);
    addInstanceMethodFor("Number", [
        ["/", ""],
        ["aNumber"],
        [],
        ["primitive", 9, "self", "aNumber"],            //recentResult := self.native / aNumber.native
        ["primitive", 4]                                // ^ recentResult
    ]);
    namespaceFor("Number");
    compileFor("Number");
    
    console.log("Объект число");
    console.log(newNumber(1000000));
    
    console.log("Словарь символов");
    console.log(stSymbols);
    console.log("Словарь классов");
    console.log(stClasses);
    
    console.log("Начало профилирования");
    for(var index = 0; index < 1000000; index ++){
        newNumber(1000000);
    };
    console.log("Конец профилирования");
    
    
    
    
    
    /******* виртуальная машина *******/
    
    /*описание контекста сообщения
    0: статус контекста
    1: количество аргументов
    2: индекс сообщения
    3: объект
    4: метод
    5: результат или вложенный контекст метода
    6: аргументы
    7: локальные переменные
    */
    
    //переменные текущего процесса
    var msgResult;
    var contextStatus= 0;
    var contexts = new Array(100);
    var contextIndex = 0;
    var currentContext;
    var isActive = true;
    
    
    //шаг сообщения
    var msg, obj;
    var stepMessage = function(){
        currentContext = contexts[contextIndex];
        obj = currentContext[3];
        //подсоединение аргументов и локальных переменных
        obj[1] = currentContext[6];
        obj[2] = currentContext[7];
        //чтение сообщения
        msg = currentContext[4][currentContext[2]];
        if (msg[0] == (-1)) {
            //выполнение примитива
            primitives[msg[1]]();
        } else {
            //передача параметров в следующий контекст
            createContext[msg[0]]();
            contextIndex ++;
        };
        currentContext[2] ++;
    };
        
    //создание контекста
    var rec, sel, arg, arg2, arg3, arg4, arg5;
    var createContext = [
        function(){
            rec = obj[msg[1]][msg[2]];
            sel = obj[0][msg[3]];
            contexts[contextIndex + 1] = [0, 0, 1, rec, sel, null, null, new Array(sel[0][1])];
        },
        function(){
            rec = obj[msg[1]][msg[2]];
            sel = obj[0][msg[3]];
            arg = obj[msg[4]][msg[5]];
            contexts[contextIndex + 1] = [0, 1, 1, rec, sel, null, [arg] , new Array(sel[0][1])];
        },
        function(){
            rec = obj[msg[1]][msg[2]];
            sel = obj[0][msg[3]];
            arg = obj[msg[4]][msg[5]];
            arg2 = obj[msg[6]][msg[7]];
            contexts[contextIndex + 1] = [0, 2, 1, rec, sel, null, [arg, arg2] , new Array(sel[0][1])];
        },
        function(){
            rec = obj[msg[1]][msg[2]];
            sel = obj[0][msg[3]];
            arg = obj[msg[4]][msg[5]];
            arg2 = obj[msg[6]][msg[7]];
            arg3 = obj[msg[8]][msg[8]];
            contexts[contextIndex + 1] = [0, 3, 1, rec, sel, null, [arg, arg2, arg3] , new Array(sel[0][1])];
        },
        function(){
            rec = obj[msg[1]][msg[2]];
            sel = obj[0][msg[3]];
            arg = obj[msg[4]][msg[5]];
            arg2 = obj[msg[6]][msg[7]];
            arg3 = obj[msg[8]][msg[9]];
            arg4 = obj[msg[10]][msg[11]];
            contexts[contextIndex + 1] = [0, 4, 1, rec, sel, null, [arg, arg2, arg3, arg4] , new Array(sel[0][1])];
        },
        function(){
            rec = obj[msg[1]][msg[2]];
            sel = obj[0][msg[3]];
            arg = obj[msg[4]][msg[5]];
            arg2 = obj[msg[6]][msg[7]];
            arg3 = obj[msg[8]][msg[9]];
            arg4 = obj[msg[10]][msg[11]];
            arg5 = obj[msg[12]][msg[13]];
            contexts[contextIndex + 1] = [0, 5, 1, rec, sel, null, [arg, arg2, arg3, arg4] , new Array(sel[0][1])];
        }
    ];
    
    var stProcess = function(){
        while(isActive){
            stepMessage();
        }
    };
    
    var contextFrom = function(obj, selector, args){
        var method = obj[0][stSymbols[selector]];
        return [0, args.length, 1, obj, method, null, args, new Array(method[0][1])]
    }
    
    
 
 
  /******* примитивы *******/   
    
    var primitiveVar;
    var primitives = [
        //0 зарезервировано
        function(){
            
        },
        //1 присваивание переменной к переменной
        function(){
            primitiveVar = obj[msg[6]][msg[7]];
            obj[msg[4]][msg[5]] = primitiveVar;
            obj[3][1] = primitiveVar;
        },
        //2 присваивание числа к переменной
        function(){
            primitiveVar = newNumber(msg[6]);
            obj[msg[4]][msg[5]] = primitiveVar;
            obj[3][1] = primitiveVar;
        },
        //3 присваивание строки к переменной
        function(){
            primitiveVar = newNumber(msg[6]); //newString(msg[6])
            obj[msg[4]][msg[5]] = primitiveVar;
            obj[3][1] = primitiveVar;
        },
        //4 возврат последнего результата сообщения (recentResult)
        function () {
            primitiveVar = obj[3][1];
            if (contextIndex > 0) {
                contexts[contextIndex] = null;
                contextIndex --;
                contexts[contextIndex][3][3][1] = primitiveVar;
            } else {
                msgResult = primitiveVar;
                isActive = false;
            };
        },
        //5 возврат результата из переменной
        function(){
            primitiveVar = obj[msg[4]][msg[5]];
            obj[3][1] = primitiveVar;
            if (contextIndex > 0){
                contexts[contextIndex] = null;
                contextIndex --;
                contexts[contextIndex][3][3][1] = primitiveVar;
            } else {
                msgResult = primitiveVar;
                isActive = false;
            };
        },
        //6 сложение чисел
        function(){
            primitiveVar = newNumber(obj[msg[4]][msg[5]][3][2] + obj[msg[6]][msg[7]][3][2]);
            obj[3][1] = primitiveVar;
        },
        //7 разность чисел
        function(){
            primitiveVar = newNumber(obj[msg[4]][msg[5]][3][2] - obj[msg[6]][msg[7]][3][2]);
            obj[3][1] = primitiveVar;
        },
        //8 умножение чисел
        function(){
            primitiveVar = newNumber(obj[msg[4]][msg[5]][3][2] * obj[msg[6]][msg[7]][3][2]);
            obj[3][1] = primitiveVar;
        },
        //9 деление чисел
        function(){
            primitiveVar = newNumber(obj[msg[4]][msg[5]][3][2] / obj[msg[6]][msg[7]][3][2]);
            obj[3][1] = primitiveVar;
        }
    ];
    
    
    contexts[0] = contextFrom(newNumber(7), "testMethodArg:arg:", [newNumber(70), newNumber(71)]);
    stProcess();
    console.log(msgResult);
    
    
})()