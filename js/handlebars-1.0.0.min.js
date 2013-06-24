/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var Handlebars={};(function(d,c){d.VERSION="1.0.0";d.COMPILER_REVISION=4;d.REVISION_CHANGES={1:"<= 1.0.rc.2",2:"== 1.0.0-rc.3",3:"== 1.0.0-rc.4",4:">= 1.0.0"};
d.helpers={};d.partials={};var n=Object.prototype.toString,b="[object Function]",h="[object Object]";d.registerHelper=function(l,u,i){if(n.call(l)===h){if(i||u){throw new d.Exception("Arg not supported with multiple helpers");
}d.Utils.extend(this.helpers,l);}else{if(i){u.not=i;}this.helpers[l]=u;}};d.registerPartial=function(i,l){if(n.call(i)===h){d.Utils.extend(this.partials,i);
}else{this.partials[i]=l;}};d.registerHelper("helperMissing",function(i){if(arguments.length===2){return c;}else{throw new Error("Missing helper: '"+i+"'");
}});d.registerHelper("blockHelperMissing",function(u,l){var i=l.inverse||function(){},w=l.fn;var v=n.call(u);if(v===b){u=u.call(this);}if(u===true){return w(this);
}else{if(u===false||u==null){return i(this);}else{if(v==="[object Array]"){if(u.length>0){return d.helpers.each(u,l);}else{return i(this);}}else{return w(u);
}}}});d.K=function(){};d.createFrame=Object.create||function(i){d.K.prototype=i;var l=new d.K();d.K.prototype=null;return l;};d.logger={DEBUG:0,INFO:1,WARN:2,ERROR:3,level:3,methodMap:{0:"debug",1:"info",2:"warn",3:"error"},log:function(u,i){if(d.logger.level<=u){var l=d.logger.methodMap[u];
if(typeof console!=="undefined"&&console[l]){console[l].call(console,i);}}}};d.log=function(l,i){d.logger.log(l,i);};d.registerHelper("each",function(l,C){var A=C.fn,v=C.inverse;
var x=0,y="",w;var z=n.call(l);if(z===b){l=l.call(this);}if(C.data){w=d.createFrame(C.data);}if(l&&typeof l==="object"){if(l instanceof Array){for(var u=l.length;
x<u;x++){if(w){w.index=x;}y=y+A(l[x],{data:w});}}else{for(var B in l){if(l.hasOwnProperty(B)){if(w){w.key=B;}y=y+A(l[B],{data:w});x++;}}}}if(x===0){y=v(this);
}return y;});d.registerHelper("if",function(l,i){var u=n.call(l);if(u===b){l=l.call(this);}if(!l||d.Utils.isEmpty(l)){return i.inverse(this);}else{return i.fn(this);
}});d.registerHelper("unless",function(l,i){return d.helpers["if"].call(this,l,{fn:i.inverse,inverse:i.fn});});d.registerHelper("with",function(l,i){var u=n.call(l);
if(u===b){l=l.call(this);}if(!d.Utils.isEmpty(l)){return i.fn(l);}});d.registerHelper("log",function(l,i){var u=i.data&&i.data.level!=null?parseInt(i.data.level,10):1;
d.log(u,l);});var r=(function(){var y={trace:function u(){},yy:{},symbols_:{error:2,root:3,program:4,EOF:5,simpleInverse:6,statements:7,statement:8,openInverse:9,closeBlock:10,openBlock:11,mustache:12,partial:13,CONTENT:14,COMMENT:15,OPEN_BLOCK:16,inMustache:17,CLOSE:18,OPEN_INVERSE:19,OPEN_ENDBLOCK:20,path:21,OPEN:22,OPEN_UNESCAPED:23,CLOSE_UNESCAPED:24,OPEN_PARTIAL:25,partialName:26,params:27,hash:28,dataName:29,param:30,STRING:31,INTEGER:32,BOOLEAN:33,hashSegments:34,hashSegment:35,ID:36,EQUALS:37,DATA:38,pathSegments:39,SEP:40,"$accept":0,"$end":1},terminals_:{2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"CLOSE_UNESCAPED",25:"OPEN_PARTIAL",31:"STRING",32:"INTEGER",33:"BOOLEAN",36:"ID",37:"EQUALS",38:"DATA",40:"SEP"},productions_:[0,[3,2],[4,2],[4,3],[4,2],[4,1],[4,1],[4,0],[7,1],[7,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[6,2],[17,3],[17,2],[17,2],[17,1],[17,1],[27,2],[27,1],[30,1],[30,1],[30,1],[30,1],[30,1],[28,1],[34,2],[34,1],[35,3],[35,3],[35,3],[35,3],[35,3],[26,1],[26,1],[26,1],[29,2],[21,1],[39,3],[39,1]],performAction:function l(z,C,D,G,F,B,E){var A=B.length-1;
switch(F){case 1:return B[A-1];break;case 2:this.$=new G.ProgramNode([],B[A]);break;case 3:this.$=new G.ProgramNode(B[A-2],B[A]);break;case 4:this.$=new G.ProgramNode(B[A-1],[]);
break;case 5:this.$=new G.ProgramNode(B[A]);break;case 6:this.$=new G.ProgramNode([],[]);break;case 7:this.$=new G.ProgramNode([]);break;case 8:this.$=[B[A]];
break;case 9:B[A-1].push(B[A]);this.$=B[A-1];break;case 10:this.$=new G.BlockNode(B[A-2],B[A-1].inverse,B[A-1],B[A]);break;case 11:this.$=new G.BlockNode(B[A-2],B[A-1],B[A-1].inverse,B[A]);
break;case 12:this.$=B[A];break;case 13:this.$=B[A];break;case 14:this.$=new G.ContentNode(B[A]);break;case 15:this.$=new G.CommentNode(B[A]);break;case 16:this.$=new G.MustacheNode(B[A-1][0],B[A-1][1]);
break;case 17:this.$=new G.MustacheNode(B[A-1][0],B[A-1][1]);break;case 18:this.$=B[A-1];break;case 19:this.$=new G.MustacheNode(B[A-1][0],B[A-1][1],B[A-2][2]==="&");
break;case 20:this.$=new G.MustacheNode(B[A-1][0],B[A-1][1],true);break;case 21:this.$=new G.PartialNode(B[A-1]);break;case 22:this.$=new G.PartialNode(B[A-2],B[A-1]);
break;case 23:break;case 24:this.$=[[B[A-2]].concat(B[A-1]),B[A]];break;case 25:this.$=[[B[A-1]].concat(B[A]),null];break;case 26:this.$=[[B[A-1]],B[A]];
break;case 27:this.$=[[B[A]],null];break;case 28:this.$=[[B[A]],null];break;case 29:B[A-1].push(B[A]);this.$=B[A-1];break;case 30:this.$=[B[A]];break;case 31:this.$=B[A];
break;case 32:this.$=new G.StringNode(B[A]);break;case 33:this.$=new G.IntegerNode(B[A]);break;case 34:this.$=new G.BooleanNode(B[A]);break;case 35:this.$=B[A];
break;case 36:this.$=new G.HashNode(B[A]);break;case 37:B[A-1].push(B[A]);this.$=B[A-1];break;case 38:this.$=[B[A]];break;case 39:this.$=[B[A-2],B[A]];
break;case 40:this.$=[B[A-2],new G.StringNode(B[A])];break;case 41:this.$=[B[A-2],new G.IntegerNode(B[A])];break;case 42:this.$=[B[A-2],new G.BooleanNode(B[A])];
break;case 43:this.$=[B[A-2],B[A]];break;case 44:this.$=new G.PartialNameNode(B[A]);break;case 45:this.$=new G.PartialNameNode(new G.StringNode(B[A]));
break;case 46:this.$=new G.PartialNameNode(new G.IntegerNode(B[A]));break;case 47:this.$=new G.DataNode(B[A]);break;case 48:this.$=new G.IdNode(B[A]);break;
case 49:B[A-2].push({part:B[A],separator:B[A-1]});this.$=B[A-2];break;case 50:this.$=[{part:B[A]}];break;}},table:[{3:1,4:2,5:[2,7],6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],22:[1,14],23:[1,15],25:[1,16]},{1:[3]},{5:[1,17]},{5:[2,6],7:18,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,6],22:[1,14],23:[1,15],25:[1,16]},{5:[2,5],6:20,8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,5],22:[1,14],23:[1,15],25:[1,16]},{17:23,18:[1,22],21:24,29:25,36:[1,28],38:[1,27],39:26},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],25:[2,8]},{4:29,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],25:[1,16]},{4:30,6:3,7:4,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,5],20:[2,7],22:[1,14],23:[1,15],25:[1,16]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],25:[2,12]},{5:[2,13],14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],25:[2,13]},{5:[2,14],14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],25:[2,14]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],25:[2,15]},{17:31,21:24,29:25,36:[1,28],38:[1,27],39:26},{17:32,21:24,29:25,36:[1,28],38:[1,27],39:26},{17:33,21:24,29:25,36:[1,28],38:[1,27],39:26},{21:35,26:34,31:[1,36],32:[1,37],36:[1,28],39:26},{1:[2,1]},{5:[2,2],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,2],22:[1,14],23:[1,15],25:[1,16]},{17:23,21:24,29:25,36:[1,28],38:[1,27],39:26},{5:[2,4],7:38,8:6,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,4],22:[1,14],23:[1,15],25:[1,16]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],25:[2,9]},{5:[2,23],14:[2,23],15:[2,23],16:[2,23],19:[2,23],20:[2,23],22:[2,23],23:[2,23],25:[2,23]},{18:[1,39]},{18:[2,27],21:44,24:[2,27],27:40,28:41,29:48,30:42,31:[1,45],32:[1,46],33:[1,47],34:43,35:49,36:[1,50],38:[1,27],39:26},{18:[2,28],24:[2,28]},{18:[2,48],24:[2,48],31:[2,48],32:[2,48],33:[2,48],36:[2,48],38:[2,48],40:[1,51]},{21:52,36:[1,28],39:26},{18:[2,50],24:[2,50],31:[2,50],32:[2,50],33:[2,50],36:[2,50],38:[2,50],40:[2,50]},{10:53,20:[1,54]},{10:55,20:[1,54]},{18:[1,56]},{18:[1,57]},{24:[1,58]},{18:[1,59],21:60,36:[1,28],39:26},{18:[2,44],36:[2,44]},{18:[2,45],36:[2,45]},{18:[2,46],36:[2,46]},{5:[2,3],8:21,9:7,11:8,12:9,13:10,14:[1,11],15:[1,12],16:[1,13],19:[1,19],20:[2,3],22:[1,14],23:[1,15],25:[1,16]},{14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],25:[2,17]},{18:[2,25],21:44,24:[2,25],28:61,29:48,30:62,31:[1,45],32:[1,46],33:[1,47],34:43,35:49,36:[1,50],38:[1,27],39:26},{18:[2,26],24:[2,26]},{18:[2,30],24:[2,30],31:[2,30],32:[2,30],33:[2,30],36:[2,30],38:[2,30]},{18:[2,36],24:[2,36],35:63,36:[1,64]},{18:[2,31],24:[2,31],31:[2,31],32:[2,31],33:[2,31],36:[2,31],38:[2,31]},{18:[2,32],24:[2,32],31:[2,32],32:[2,32],33:[2,32],36:[2,32],38:[2,32]},{18:[2,33],24:[2,33],31:[2,33],32:[2,33],33:[2,33],36:[2,33],38:[2,33]},{18:[2,34],24:[2,34],31:[2,34],32:[2,34],33:[2,34],36:[2,34],38:[2,34]},{18:[2,35],24:[2,35],31:[2,35],32:[2,35],33:[2,35],36:[2,35],38:[2,35]},{18:[2,38],24:[2,38],36:[2,38]},{18:[2,50],24:[2,50],31:[2,50],32:[2,50],33:[2,50],36:[2,50],37:[1,65],38:[2,50],40:[2,50]},{36:[1,66]},{18:[2,47],24:[2,47],31:[2,47],32:[2,47],33:[2,47],36:[2,47],38:[2,47]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],25:[2,10]},{21:67,36:[1,28],39:26},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],25:[2,11]},{14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],25:[2,16]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],25:[2,19]},{5:[2,20],14:[2,20],15:[2,20],16:[2,20],19:[2,20],20:[2,20],22:[2,20],23:[2,20],25:[2,20]},{5:[2,21],14:[2,21],15:[2,21],16:[2,21],19:[2,21],20:[2,21],22:[2,21],23:[2,21],25:[2,21]},{18:[1,68]},{18:[2,24],24:[2,24]},{18:[2,29],24:[2,29],31:[2,29],32:[2,29],33:[2,29],36:[2,29],38:[2,29]},{18:[2,37],24:[2,37],36:[2,37]},{37:[1,65]},{21:69,29:73,31:[1,70],32:[1,71],33:[1,72],36:[1,28],38:[1,27],39:26},{18:[2,49],24:[2,49],31:[2,49],32:[2,49],33:[2,49],36:[2,49],38:[2,49],40:[2,49]},{18:[1,74]},{5:[2,22],14:[2,22],15:[2,22],16:[2,22],19:[2,22],20:[2,22],22:[2,22],23:[2,22],25:[2,22]},{18:[2,39],24:[2,39],36:[2,39]},{18:[2,40],24:[2,40],36:[2,40]},{18:[2,41],24:[2,41],36:[2,41]},{18:[2,42],24:[2,42],36:[2,42]},{18:[2,43],24:[2,43],36:[2,43]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],25:[2,18]}],defaultActions:{17:[2,1]},parseError:function v(A,z){throw new Error(A);
},parse:function x(I){var P=this,F=[0],Y=[null],K=[],Z=this.table,A="",J=0,W=0,C=0,H=2,M=1;this.lexer.setInput(I);this.lexer.yy=this.yy;this.yy.lexer=this.lexer;
this.yy.parser=this;if(typeof this.lexer.yylloc=="undefined"){this.lexer.yylloc={};}var B=this.lexer.yylloc;K.push(B);var D=this.lexer.options&&this.lexer.options.ranges;
if(typeof this.yy.parseError==="function"){this.parseError=this.yy.parseError;}function O(ab){F.length=F.length-2*ab;Y.length=Y.length-ab;K.length=K.length-ab;
}function N(){var ab;ab=P.lexer.lex()||1;if(typeof ab!=="number"){ab=P.symbols_[ab]||ab;}return ab;}var V,R,E,U,aa,L,T={},Q,X,z,G;while(true){E=F[F.length-1];
if(this.defaultActions[E]){U=this.defaultActions[E];}else{if(V===null||typeof V=="undefined"){V=N();}U=Z[E]&&Z[E][V];}if(typeof U==="undefined"||!U.length||!U[0]){var S="";
if(!C){G=[];for(Q in Z[E]){if(this.terminals_[Q]&&Q>2){G.push("'"+this.terminals_[Q]+"'");}}if(this.lexer.showPosition){S="Parse error on line "+(J+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+G.join(", ")+", got '"+(this.terminals_[V]||V)+"'";
}else{S="Parse error on line "+(J+1)+": Unexpected "+(V==1?"end of input":"'"+(this.terminals_[V]||V)+"'");}this.parseError(S,{text:this.lexer.match,token:this.terminals_[V]||V,line:this.lexer.yylineno,loc:B,expected:G});
}}if(U[0] instanceof Array&&U.length>1){throw new Error("Parse Error: multiple actions possible at state: "+E+", token: "+V);}switch(U[0]){case 1:F.push(V);
Y.push(this.lexer.yytext);K.push(this.lexer.yylloc);F.push(U[1]);V=null;if(!R){W=this.lexer.yyleng;A=this.lexer.yytext;J=this.lexer.yylineno;B=this.lexer.yylloc;
if(C>0){C--;}}else{V=R;R=null;}break;case 2:X=this.productions_[U[1]][1];T.$=Y[Y.length-X];T._$={first_line:K[K.length-(X||1)].first_line,last_line:K[K.length-1].last_line,first_column:K[K.length-(X||1)].first_column,last_column:K[K.length-1].last_column};
if(D){T._$.range=[K[K.length-(X||1)].range[0],K[K.length-1].range[1]];}L=this.performAction.call(T,A,W,J,this.yy,U[1],Y,K);if(typeof L!=="undefined"){return L;
}if(X){F=F.slice(0,-1*X*2);Y=Y.slice(0,-1*X);K=K.slice(0,-1*X);}F.push(this.productions_[U[1]][0]);Y.push(T.$);K.push(T._$);z=Z[F[F.length-2]][F[F.length-1]];
F.push(z);break;case 3:return true;}}return true;}};var i=(function(){var C=({EOF:1,parseError:function E(H,G){if(this.yy.parser){this.yy.parser.parseError(H,G);
}else{throw new Error(H);}},setInput:function(G){this._input=G;this._more=this._less=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match="";
this.conditionStack=["INITIAL"];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges){this.yylloc.range=[0,0];}this.offset=0;
return this;},input:function(){var H=this._input[0];this.yytext+=H;this.yyleng++;this.offset++;this.match+=H;this.matched+=H;var G=H.match(/(?:\r\n?|\n).*/g);
if(G){this.yylineno++;this.yylloc.last_line++;}else{this.yylloc.last_column++;}if(this.options.ranges){this.yylloc.range[1]++;}this._input=this._input.slice(1);
return H;},unput:function(I){var G=I.length;var H=I.split(/(?:\r\n?|\n)/g);this._input=I+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-G-1);
this.offset-=G;var K=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);
if(H.length-1){this.yylineno-=H.length-1;}var J=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:H?(H.length===K.length?this.yylloc.first_column:0)+K[K.length-H.length].length-H[0].length:this.yylloc.first_column-G};
if(this.options.ranges){this.yylloc.range=[J[0],J[0]+this.yyleng-G];}return this;},more:function(){this._more=true;return this;},less:function(G){this.unput(this.match.slice(G));
},pastInput:function(){var G=this.matched.substr(0,this.matched.length-this.match.length);return(G.length>20?"...":"")+G.substr(-20).replace(/\n/g,"");
},upcomingInput:function(){var G=this.match;if(G.length<20){G+=this._input.substr(0,20-G.length);}return(G.substr(0,20)+(G.length>20?"...":"")).replace(/\n/g,"");
},showPosition:function(){var G=this.pastInput();var H=new Array(G.length+1).join("-");return G+this.upcomingInput()+"\n"+H+"^";},next:function(){if(this.done){return this.EOF;
}if(!this._input){this.done=true;}var M,K,H,J,I,G;if(!this._more){this.yytext="";this.match="";}var N=this._currentRules();for(var L=0;L<N.length;L++){H=this._input.match(this.rules[N[L]]);
if(H&&(!K||H[0].length>K[0].length)){K=H;J=L;if(!this.options.flex){break;}}}if(K){G=K[0].match(/(?:\r\n?|\n).*/g);if(G){this.yylineno+=G.length;}this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:G?G[G.length-1].length-G[G.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+K[0].length};
this.yytext+=K[0];this.match+=K[0];this.matches=K;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng];
}this._more=false;this._input=this._input.slice(K[0].length);this.matched+=K[0];M=this.performAction.call(this,this.yy,this,N[J],this.conditionStack[this.conditionStack.length-1]);
if(this.done&&this._input){this.done=false;}if(M){return M;}else{return;}}if(this._input===""){return this.EOF;}else{return this.parseError("Lexical error on line "+(this.yylineno+1)+". Unrecognized text.\n"+this.showPosition(),{text:"",token:null,line:this.yylineno});
}},lex:function z(){var G=this.next();if(typeof G!=="undefined"){return G;}else{return this.lex();}},begin:function A(G){this.conditionStack.push(G);},popState:function F(){return this.conditionStack.pop();
},_currentRules:function D(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;},topState:function(){return this.conditionStack[this.conditionStack.length-2];
},pushState:function A(G){this.begin(G);}});C.options={};C.performAction=function B(K,H,J,G){var I=G;switch(J){case 0:H.yytext="\\";return 14;break;case 1:if(H.yytext.slice(-1)!=="\\"){this.begin("mu");
}if(H.yytext.slice(-1)==="\\"){H.yytext=H.yytext.substr(0,H.yyleng-1),this.begin("emu");}if(H.yytext){return 14;}break;case 2:return 14;break;case 3:if(H.yytext.slice(-1)!=="\\"){this.popState();
}if(H.yytext.slice(-1)==="\\"){H.yytext=H.yytext.substr(0,H.yyleng-1);}return 14;break;case 4:H.yytext=H.yytext.substr(0,H.yyleng-4);this.popState();return 15;
break;case 5:return 25;break;case 6:return 16;break;case 7:return 20;break;case 8:return 19;break;case 9:return 19;break;case 10:return 23;break;case 11:return 22;
break;case 12:this.popState();this.begin("com");break;case 13:H.yytext=H.yytext.substr(3,H.yyleng-5);this.popState();return 15;break;case 14:return 22;
break;case 15:return 37;break;case 16:return 36;break;case 17:return 36;break;case 18:return 40;break;case 19:break;case 20:this.popState();return 24;break;
case 21:this.popState();return 18;break;case 22:H.yytext=H.yytext.substr(1,H.yyleng-2).replace(/\\"/g,'"');return 31;break;case 23:H.yytext=H.yytext.substr(1,H.yyleng-2).replace(/\\'/g,"'");
return 31;break;case 24:return 38;break;case 25:return 33;break;case 26:return 33;break;case 27:return 32;break;case 28:return 36;break;case 29:H.yytext=H.yytext.substr(1,H.yyleng-2);
return 36;break;case 30:return"INVALID";break;case 31:return 5;break;}};C.rules=[/^(?:\\\\(?=(\{\{)))/,/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|$)))/,/^(?:[\s\S]*?--\}\})/,/^(?:\{\{>)/,/^(?:\{\{#)/,/^(?:\{\{\/)/,/^(?:\{\{\^)/,/^(?:\{\{\s*else\b)/,/^(?:\{\{\{)/,/^(?:\{\{&)/,/^(?:\{\{!--)/,/^(?:\{\{![\s\S]*?\}\})/,/^(?:\{\{)/,/^(?:=)/,/^(?:\.(?=[}\/ ]))/,/^(?:\.\.)/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}\}\})/,/^(?:\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=[}\s]))/,/^(?:false(?=[}\s]))/,/^(?:-?[0-9]+(?=[}\s]))/,/^(?:[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.]))/,/^(?:\[[^\]]*\])/,/^(?:.)/,/^(?:$)/];
C.conditions={mu:{rules:[5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],inclusive:false},emu:{rules:[3],inclusive:false},com:{rules:[4],inclusive:false},INITIAL:{rules:[0,1,2,31],inclusive:true}};
return C;})();y.lexer=i;function w(){this.yy={};}w.prototype=y;y.Parser=w;return new w;})();d.Parser=r;d.parse=function(i){if(i.constructor===d.AST.ProgramNode){return i;
}d.Parser.yy=d.AST;return d.Parser.parse(i);};d.AST={};d.AST.ProgramNode=function(l,i){this.type="program";this.statements=l;if(i){this.inverse=new d.AST.ProgramNode(i);
}};d.AST.MustacheNode=function(x,u,l){this.type="mustache";this.escaped=!l;this.hash=u;var w=this.id=x[0];var v=this.params=x.slice(1);var i=this.eligibleHelper=w.isSimple;
this.isHelper=i&&(v.length||u);};d.AST.PartialNode=function(i,l){this.type="partial";this.partialName=i;this.context=l;};d.AST.BlockNode=function(u,l,i,w){var v=function(x,y){if(x.original!==y.original){throw new d.Exception(x.original+" doesn't match "+y.original);
}};v(u.id,w);this.type="block";this.mustache=u;this.program=l;this.inverse=i;if(this.inverse&&!this.program){this.isInverse=true;}};d.AST.ContentNode=function(i){this.type="content";
this.string=i;};d.AST.HashNode=function(i){this.type="hash";this.pairs=i;};d.AST.IdNode=function(z){this.type="ID";var y="",w=[],A=0;for(var x=0,u=z.length;
x<u;x++){var v=z[x].part;y+=(z[x].separator||"")+v;if(v===".."||v==="."||v==="this"){if(w.length>0){throw new d.Exception("Invalid path: "+y);}else{if(v===".."){A++;
}else{this.isScoped=true;}}}else{w.push(v);}}this.original=y;this.parts=w;this.string=w.join(".");this.depth=A;this.isSimple=z.length===1&&!this.isScoped&&A===0;
this.stringModeValue=this.string;};d.AST.PartialNameNode=function(i){this.type="PARTIAL_NAME";this.name=i.original;};d.AST.DataNode=function(i){this.type="DATA";
this.id=i;};d.AST.StringNode=function(i){this.type="STRING";this.original=this.string=this.stringModeValue=i;};d.AST.IntegerNode=function(i){this.type="INTEGER";
this.original=this.integer=i;this.stringModeValue=Number(i);};d.AST.BooleanNode=function(i){this.type="BOOLEAN";this.bool=i;this.stringModeValue=i==="true";
};d.AST.CommentNode=function(i){this.type="comment";this.comment=i;};var q=["description","fileName","lineNumber","message","name","number","stack"];d.Exception=function(u){var l=Error.prototype.constructor.apply(this,arguments);
for(var i=0;i<q.length;i++){this[q[i]]=l[q[i]];}};d.Exception.prototype=new Error();d.SafeString=function(i){this.string=i;};d.SafeString.prototype.toString=function(){return this.string.toString();
};var k={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};var e=/[&<>"'`]/g;var p=/[&<>"'`]/;var t=function(i){return k[i]||"&amp;";
};d.Utils={extend:function(u,l){for(var i in l){if(l.hasOwnProperty(i)){u[i]=l[i];}}},escapeExpression:function(i){if(i instanceof d.SafeString){return i.toString();
}else{if(i==null||i===false){return"";}}i=i.toString();if(!p.test(i)){return i;}return i.replace(e,t);},isEmpty:function(i){if(!i&&i!==0){return true;}else{if(n.call(i)==="[object Array]"&&i.length===0){return true;
}else{return false;}}}};var j=d.Compiler=function(){};var g=d.JavaScriptCompiler=function(){};j.prototype={compiler:j,disassemble:function(){var z=this.opcodes,y,w=[],B,A;
for(var x=0,u=z.length;x<u;x++){y=z[x];if(y.opcode==="DECLARE"){w.push("DECLARE "+y.name+"="+y.value);}else{B=[];for(var v=0;v<y.args.length;v++){A=y.args[v];
if(typeof A==="string"){A='"'+A.replace("\n","\\n")+'"';}B.push(A);}w.push(y.opcode+" "+B.join(" "));}}return w.join("\n");},equals:function(u){var l=this.opcodes.length;
if(u.opcodes.length!==l){return false;}for(var x=0;x<l;x++){var y=this.opcodes[x],v=u.opcodes[x];if(y.opcode!==v.opcode||y.args.length!==v.args.length){return false;
}for(var w=0;w<y.args.length;w++){if(y.args[w]!==v.args[w]){return false;}}}l=this.children.length;if(u.children.length!==l){return false;}for(x=0;x<l;
x++){if(!this.children[x].equals(u.children[x])){return false;}}return true;},guid:0,compile:function(i,u){this.children=[];this.depths={list:[]};this.options=u;
var v=this.options.knownHelpers;this.options.knownHelpers={helperMissing:true,blockHelperMissing:true,each:true,"if":true,unless:true,"with":true,log:true};
if(v){for(var l in v){this.options.knownHelpers[l]=v[l];}}return this.program(i);},accept:function(i){return this[i.type](i);},program:function(w){var v=w.statements,y;
this.opcodes=[];for(var x=0,u=v.length;x<u;x++){y=v[x];this[y.type](y);}this.isSimple=u===1;this.depths.list=this.depths.list.sort(function(l,i){return l-i;
});return this;},compileProgram:function(w){var u=new this.compiler().compile(w,this.options);var x=this.guid++,z;this.usePartial=this.usePartial||u.usePartial;
this.children[x]=u;for(var y=0,v=u.depths.list.length;y<v;y++){z=u.depths.list[y];if(z<2){continue;}else{this.addDepth(z-1);}}return x;},block:function(w){var v=w.mustache,l=w.program,i=w.inverse;
if(l){l=this.compileProgram(l);}if(i){i=this.compileProgram(i);}var u=this.classifyMustache(v);if(u==="helper"){this.helperMustache(v,l,i);}else{if(u==="simple"){this.simpleMustache(v);
this.opcode("pushProgram",l);this.opcode("pushProgram",i);this.opcode("emptyHash");this.opcode("blockValue");}else{this.ambiguousMustache(v,l,i);this.opcode("pushProgram",l);
this.opcode("pushProgram",i);this.opcode("emptyHash");this.opcode("ambiguousBlockValue");}}this.opcode("append");},hash:function(x){var w=x.pairs,z,y;this.opcode("pushHash");
for(var v=0,u=w.length;v<u;v++){z=w[v];y=z[1];if(this.options.stringParams){if(y.depth){this.addDepth(y.depth);}this.opcode("getContext",y.depth||0);this.opcode("pushStringParam",y.stringModeValue,y.type);
}else{this.accept(y);}this.opcode("assignToHash",z[0]);}this.opcode("popHash");},partial:function(i){var l=i.partialName;this.usePartial=true;if(i.context){this.ID(i.context);
}else{this.opcode("push","depth0");}this.opcode("invokePartial",l.name);this.opcode("append");},content:function(i){this.opcode("appendContent",i.string);
},mustache:function(u){var i=this.options;var l=this.classifyMustache(u);if(l==="simple"){this.simpleMustache(u);}else{if(l==="helper"){this.helperMustache(u);
}else{this.ambiguousMustache(u);}}if(u.escaped&&!i.noEscape){this.opcode("appendEscaped");}else{this.opcode("append");}},ambiguousMustache:function(w,u,l){var x=w.id,v=x.parts[0],i=u!=null||l!=null;
this.opcode("getContext",x.depth);this.opcode("pushProgram",u);this.opcode("pushProgram",l);this.opcode("invokeAmbiguous",v,i);},simpleMustache:function(i){var l=i.id;
if(l.type==="DATA"){this.DATA(l);}else{if(l.parts.length){this.ID(l);}else{this.addDepth(l.depth);this.opcode("getContext",l.depth);this.opcode("pushContext");
}}this.opcode("resolvePossibleLambda");},helperMustache:function(v,l,i){var w=this.setupFullMustacheParams(v,l,i),u=v.id.parts[0];if(this.options.knownHelpers[u]){this.opcode("invokeKnownHelper",w.length,u);
}else{if(this.options.knownHelpersOnly){throw new Error("You specified knownHelpersOnly, but used the unknown helper "+u);}else{this.opcode("invokeHelper",w.length,u);
}}},ID:function(x){this.addDepth(x.depth);this.opcode("getContext",x.depth);var v=x.parts[0];if(!v){this.opcode("pushContext");}else{this.opcode("lookupOnContext",x.parts[0]);
}for(var w=1,u=x.parts.length;w<u;w++){this.opcode("lookup",x.parts[w]);}},DATA:function(w){this.options.data=true;if(w.id.isScoped||w.id.depth){throw new d.Exception("Scoped data references are not supported: "+w.original);
}this.opcode("lookupData");var x=w.id.parts;for(var v=0,u=x.length;v<u;v++){this.opcode("lookup",x[v]);}},STRING:function(i){this.opcode("pushString",i.string);
},INTEGER:function(i){this.opcode("pushLiteral",i.integer);},BOOLEAN:function(i){this.opcode("pushLiteral",i.bool);},comment:function(){},opcode:function(i){this.opcodes.push({opcode:i,args:[].slice.call(arguments,1)});
},declare:function(i,l){this.opcodes.push({opcode:"DECLARE",name:i,value:l});},addDepth:function(i){if(isNaN(i)){throw new Error("EWOT");}if(i===0){return;
}if(!this.depths[i]){this.depths[i]=true;this.depths.list.push(i);}},classifyMustache:function(v){var u=v.isHelper;var w=v.eligibleHelper;var l=this.options;
if(w&&!u){var i=v.id.parts[0];if(l.knownHelpers[i]){u=true;}else{if(l.knownHelpersOnly){w=false;}}}if(u){return"helper";}else{if(w){return"ambiguous";}else{return"simple";
}}},pushParams:function(v){var l=v.length,u;while(l--){u=v[l];if(this.options.stringParams){if(u.depth){this.addDepth(u.depth);}this.opcode("getContext",u.depth||0);
this.opcode("pushStringParam",u.stringModeValue,u.type);}else{this[u.type](u);}}},setupMustacheParams:function(i){var l=i.params;this.pushParams(l);if(i.hash){this.hash(i.hash);
}else{this.opcode("emptyHash");}return l;},setupFullMustacheParams:function(u,l,i){var v=u.params;this.pushParams(v);this.opcode("pushProgram",l);this.opcode("pushProgram",i);
if(u.hash){this.hash(u.hash);}else{this.opcode("emptyHash");}return v;}};var s=function(i){this.value=i;};g.prototype={nameLookup:function(l,i){if(/^[0-9]+$/.test(i)){return l+"["+i+"]";
}else{if(g.isValidJavaScriptVariableName(i)){return l+"."+i;}else{return l+"['"+i+"']";}}},appendToBuffer:function(i){if(this.environment.isSimple){return"return "+i+";";
}else{return{appendToBuffer:true,content:i,toString:function(){return"buffer += "+i+";";}};}},initializeBuffer:function(){return this.quotedString("");
},namespace:"Handlebars",compile:function(i,l,v,u){this.environment=i;this.options=l||{};d.log(d.logger.DEBUG,this.environment.disassemble()+"\n\n");this.name=this.environment.name;
this.isChild=!!v;this.context=v||{programs:[],environments:[],aliases:{}};this.preamble();this.stackSlot=0;this.stackVars=[];this.registers={list:[]};this.compileStack=[];
this.inlineStack=[];this.compileChildren(i,l);var x=i.opcodes,w;this.i=0;for(m=x.length;this.i<m;this.i++){w=x[this.i];if(w.opcode==="DECLARE"){this[w.name]=w.value;
}else{this[w.opcode].apply(this,w.args);}}return this.createFunctionContext(u);},nextOpcode:function(){var i=this.environment.opcodes;return i[this.i+1];
},eat:function(){this.i=this.i+1;},preamble:function(){var i=[];if(!this.isChild){var l=this.namespace;var u="helpers = this.merge(helpers, "+l+".helpers);";
if(this.environment.usePartial){u=u+" partials = this.merge(partials, "+l+".partials);";}if(this.options.data){u=u+" data = data || {};";}i.push(u);}else{i.push("");
}if(!this.environment.isSimple){i.push(", buffer = "+this.initializeBuffer());}else{i.push("");}this.lastContext=0;this.source=i;},createFunctionContext:function(B){var w=this.stackVars.concat(this.registers.list);
if(w.length>0){this.source[1]=this.source[1]+", "+w.join(", ");}if(!this.isChild){for(var A in this.context.aliases){if(this.context.aliases.hasOwnProperty(A)){this.source[1]=this.source[1]+", "+A+"="+this.context.aliases[A];
}}}if(this.source[1]){this.source[1]="var "+this.source[1].substring(2)+";";}if(!this.isChild){this.source[1]+="\n"+this.context.programs.join("\n")+"\n";
}if(!this.environment.isSimple){this.source.push("return buffer;");}var y=this.isChild?["depth0","data"]:["Handlebars","depth0","helpers","partials","data"];
for(var z=0,x=this.environment.depths.list.length;z<x;z++){y.push("depth"+this.environment.depths.list[z]);}var u=this.mergeSource();if(!this.isChild){var C=d.COMPILER_REVISION,v=d.REVISION_CHANGES[C];
u="this.compilerInfo = ["+C+",'"+v+"'];\n"+u;}if(B){y.push(u);return Function.apply(this,y);}else{var D="function "+(this.name||"")+"("+y.join(",")+") {\n  "+u+"}";
d.log(d.logger.DEBUG,D+"\n\n");return D;}},mergeSource:function(){var x="",v;for(var w=0,l=this.source.length;w<l;w++){var u=this.source[w];if(u.appendToBuffer){if(v){v=v+"\n    + "+u.content;
}else{v=u.content;}}else{if(v){x+="buffer += "+v+";\n  ";v=c;}x+=u+"\n  ";}}return x;},blockValue:function(){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";
var i=["depth0"];this.setupParams(0,i);this.replaceStack(function(l){i.splice(1,0,l);return"blockHelperMissing.call("+i.join(", ")+")";});},ambiguousBlockValue:function(){this.context.aliases.blockHelperMissing="helpers.blockHelperMissing";
var l=["depth0"];this.setupParams(0,l);var i=this.topStack();l.splice(1,0,i);l[l.length-1]="options";this.source.push("if (!"+this.lastHelper+") { "+i+" = blockHelperMissing.call("+l.join(", ")+"); }");
},appendContent:function(i){this.source.push(this.appendToBuffer(this.quotedString(i)));},append:function(){this.flushInline();var i=this.popStack();this.source.push("if("+i+" || "+i+" === 0) { "+this.appendToBuffer(i)+" }");
if(this.environment.isSimple){this.source.push("else { "+this.appendToBuffer("''")+" }");}},appendEscaped:function(){this.context.aliases.escapeExpression="this.escapeExpression";
this.source.push(this.appendToBuffer("escapeExpression("+this.popStack()+")"));},getContext:function(i){if(this.lastContext!==i){this.lastContext=i;}},lookupOnContext:function(i){this.push(this.nameLookup("depth"+this.lastContext,i,"context"));
},pushContext:function(){this.pushStackLiteral("depth"+this.lastContext);},resolvePossibleLambda:function(){this.context.aliases.functionType='"function"';
this.replaceStack(function(i){return"typeof "+i+" === functionType ? "+i+".apply(depth0) : "+i;});},lookup:function(i){this.replaceStack(function(l){return l+" == null || "+l+" === false ? "+l+" : "+this.nameLookup(l,i,"context");
});},lookupData:function(i){this.push("data");},pushStringParam:function(i,l){this.pushStackLiteral("depth"+this.lastContext);this.pushString(l);if(typeof i==="string"){this.pushString(i);
}else{this.pushStackLiteral(i);}},emptyHash:function(){this.pushStackLiteral("{}");if(this.options.stringParams){this.register("hashTypes","{}");this.register("hashContexts","{}");
}},pushHash:function(){this.hash={values:[],types:[],contexts:[]};},popHash:function(){var i=this.hash;this.hash=c;if(this.options.stringParams){this.register("hashContexts","{"+i.contexts.join(",")+"}");
this.register("hashTypes","{"+i.types.join(",")+"}");}this.push("{\n    "+i.values.join(",\n    ")+"\n  }");},pushString:function(i){this.pushStackLiteral(this.quotedString(i));
},push:function(i){this.inlineStack.push(i);return i;},pushLiteral:function(i){this.pushStackLiteral(i);},pushProgram:function(i){if(i!=null){this.pushStackLiteral(this.programExpression(i));
}else{this.pushStackLiteral(null);}},invokeHelper:function(u,i){this.context.aliases.helperMissing="helpers.helperMissing";var l=this.lastHelper=this.setupHelper(u,i,true);
var v=this.nameLookup("depth"+this.lastContext,i,"context");this.push(l.name+" || "+v);this.replaceStack(function(w){return w+" ? "+w+".call("+l.callParams+") : helperMissing.call("+l.helperMissingParams+")";
});},invokeKnownHelper:function(u,i){var l=this.setupHelper(u,i);this.push(l.name+".call("+l.callParams+")");},invokeAmbiguous:function(i,w){this.context.aliases.functionType='"function"';
this.pushStackLiteral("{}");var l=this.setupHelper(0,i,w);var u=this.lastHelper=this.nameLookup("helpers",i,"helper");var x=this.nameLookup("depth"+this.lastContext,i,"context");
var v=this.nextStack();this.source.push("if ("+v+" = "+u+") { "+v+" = "+v+".call("+l.callParams+"); }");this.source.push("else { "+v+" = "+x+"; "+v+" = typeof "+v+" === functionType ? "+v+".apply(depth0) : "+v+"; }");
},invokePartial:function(i){var l=[this.nameLookup("partials",i,"partial"),"'"+i+"'",this.popStack(),"helpers","partials"];if(this.options.data){l.push("data");
}this.context.aliases.self="this";this.push("self.invokePartial("+l.join(", ")+")");},assignToHash:function(l){var v=this.popStack(),i,u;if(this.options.stringParams){u=this.popStack();
i=this.popStack();}var w=this.hash;if(i){w.contexts.push("'"+l+"': "+i);}if(u){w.types.push("'"+l+"': "+u);}w.values.push("'"+l+"': ("+v+")");},compiler:g,compileChildren:function(u,x){var z=u.children,B,A;
for(var y=0,v=z.length;y<v;y++){B=z[y];A=new this.compiler();var w=this.matchExistingProgram(B);if(w==null){this.context.programs.push("");w=this.context.programs.length;
B.index=w;B.name="program"+w;this.context.programs[w]=A.compile(B,x,this.context);this.context.environments[w]=B;}else{B.index=w;B.name="program"+w;}}},matchExistingProgram:function(w){for(var v=0,u=this.context.environments.length;
v<u;v++){var l=this.context.environments[v];if(l&&l.equals(w)){return v;}}},programExpression:function(v){this.context.aliases.self="this";if(v==null){return"self.noop";
}var A=this.environment.children[v],z=A.depths.list,y;var x=[A.index,A.name,"data"];for(var w=0,u=z.length;w<u;w++){y=z[w];if(y===1){x.push("depth0");}else{x.push("depth"+(y-1));
}}return(z.length===0?"self.program(":"self.programWithDepth(")+x.join(", ")+")";},register:function(i,l){this.useRegister(i);this.source.push(i+" = "+l+";");
},useRegister:function(i){if(!this.registers[i]){this.registers[i]=true;this.registers.list.push(i);}},pushStackLiteral:function(i){return this.push(new s(i));
},pushStack:function(l){this.flushInline();var i=this.incrStack();if(l){this.source.push(i+" = "+l+";");}this.compileStack.push(i);return i;},replaceStack:function(y){var v="",x=this.isInline(),i;
if(x){var w=this.popStack(true);if(w instanceof s){i=w.value;}else{var l=this.stackSlot?this.topStackName():this.incrStack();v="("+this.push(l)+" = "+w+"),";
i=this.topStack();}}else{i=this.topStack();}var u=y.call(this,i);if(x){if(this.inlineStack.length||this.compileStack.length){this.popStack();}this.push("("+v+u+")");
}else{if(!/^stack/.test(i)){i=this.nextStack();}this.source.push(i+" = ("+v+u+");");}return i;},nextStack:function(){return this.pushStack();},incrStack:function(){this.stackSlot++;
if(this.stackSlot>this.stackVars.length){this.stackVars.push("stack"+this.stackSlot);}return this.topStackName();},topStackName:function(){return"stack"+this.stackSlot;
},flushInline:function(){var v=this.inlineStack;if(v.length){this.inlineStack=[];for(var u=0,l=v.length;u<l;u++){var w=v[u];if(w instanceof s){this.compileStack.push(w);
}else{this.pushStack(w);}}}},isInline:function(){return this.inlineStack.length;},popStack:function(i){var u=this.isInline(),l=(u?this.inlineStack:this.compileStack).pop();
if(!i&&(l instanceof s)){return l.value;}else{if(!u){this.stackSlot--;}return l;}},topStack:function(l){var i=(this.isInline()?this.inlineStack:this.compileStack),u=i[i.length-1];
if(!l&&(u instanceof s)){return u.value;}else{return u;}},quotedString:function(i){return'"'+i.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\u2028/g,"\\u2028").replace(/\u2029/g,"\\u2029")+'"';
},setupHelper:function(w,u,l){var v=[];this.setupParams(w,v,l);var i=this.nameLookup("helpers",u,"helper");return{params:v,name:i,callParams:["depth0"].concat(v).join(", "),helperMissingParams:l&&["depth0",this.quotedString(u)].concat(v).join(", ")};
},setupParams:function(w,v,l){var C=[],A=[],B=[],u,x,z;C.push("hash:"+this.popStack());x=this.popStack();z=this.popStack();if(z||x){if(!z){this.context.aliases.self="this";
z="self.noop";}if(!x){this.context.aliases.self="this";x="self.noop";}C.push("inverse:"+x);C.push("fn:"+z);}for(var y=0;y<w;y++){u=this.popStack();v.push(u);
if(this.options.stringParams){B.push(this.popStack());A.push(this.popStack());}}if(this.options.stringParams){C.push("contexts:["+A.join(",")+"]");C.push("types:["+B.join(",")+"]");
C.push("hashContexts:hashContexts");C.push("hashTypes:hashTypes");}if(this.options.data){C.push("data:data");}C="{"+C.join(",")+"}";if(l){this.register("options",C);
v.push("options");}else{v.push(C);}return v.join(", ");}};var f=("break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield").split(" ");
var a=g.RESERVED_WORDS={};for(var o=0,m=f.length;o<m;o++){a[f[o]]=true;}g.isValidJavaScriptVariableName=function(i){if(!g.RESERVED_WORDS[i]&&/^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(i)){return true;
}return false;};d.precompile=function(u,v){if(u==null||(typeof u!=="string"&&u.constructor!==d.AST.ProgramNode)){throw new d.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed "+u);
}v=v||{};if(!("data" in v)){v.data=true;}var l=d.parse(u);var i=new j().compile(l,v);return new g().compile(i,v);};d.compile=function(i,l){if(i==null||(typeof i!=="string"&&i.constructor!==d.AST.ProgramNode)){throw new d.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed "+i);
}l=l||{};if(!("data" in l)){l.data=true;}var v;function u(){var y=d.parse(i);var x=new j().compile(y,l);var w=new g().compile(x,l,c,true);return d.template(w);
}return function(x,w){if(!v){v=u();}return v.call(this,x,w);};};d.VM={template:function(i){var l={escapeExpression:d.Utils.escapeExpression,invokePartial:d.VM.invokePartial,programs:[],program:function(v,w,x){var u=this.programs[v];
if(x){u=d.VM.program(v,w,x);}else{if(!u){u=this.programs[v]=d.VM.program(v,w);}}return u;},merge:function(w,v){var u=w||v;if(w&&v){u={};d.Utils.extend(u,v);
d.Utils.extend(u,w);}return u;},programWithDepth:d.VM.programWithDepth,noop:d.VM.noop,compilerInfo:null};return function(y,x){x=x||{};var v=i.call(l,d,y,x.helpers,x.partials,x.data);
var z=l.compilerInfo||[],w=z[0]||1,B=d.COMPILER_REVISION;if(w!==B){if(w<B){var u=d.REVISION_CHANGES[B],A=d.REVISION_CHANGES[w];throw"Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version ("+u+") or downgrade your runtime to an older version ("+A+").";
}else{throw"Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version ("+z[1]+").";
}}return v;};},programWithDepth:function(v,w,x){var u=Array.prototype.slice.call(arguments,3);var l=function(y,i){i=i||{};return w.apply(this,[y,i.data||x].concat(u));
};l.program=v;l.depth=u.length;return l;},program:function(u,v,w){var l=function(x,i){i=i||{};return v(x,i.data||w);};l.program=u;l.depth=0;return l;},noop:function(){return"";
},invokePartial:function(i,u,w,x,v,y){var l={helpers:x,partials:v,data:y};if(i===c){throw new d.Exception("The partial "+u+" could not be found");}else{if(i instanceof Function){return i(w,l);
}else{if(!d.compile){throw new d.Exception("The partial "+u+" could not be compiled when running in runtime-only mode");}else{v[u]=d.compile(i,{data:y!==c});
return v[u](w,l);}}}}};d.template=d.VM.template;})(Handlebars);