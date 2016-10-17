$(document).ready(function(){
// navigacija
$("#navigacija>li>ul").hide();
$("#navigacija>li").hover(function(){$(this).children("ul").slideDown(300);},
							function(){$(this).children("ul").slideUp(300);});
// nakon malog tajmauta pokreni vaznije funkcije
window.setTimeout("$.paliOdma()",50);
// testis zona
});
jQuery.extend({	// stare metode prebacene u $.namespace
paliOdma: function (){	// pokrice funkcije nakon $(document).ready();
// kozmetika
$.navigacijaPoNaslovima();
$("h1").prepend("..::&nbsp;").append("&nbsp;::..");
$("h2, h3").prepend(".:.&nbsp;").append("&nbsp;.:.");
$("table.zebra tbody tr:nth-child(odd)").css("background-color","#F0F0F0");
$.podnozje(1,1);
$.zadnjaPromjena();
window.setTimeout("$.paliKasnije()",500);
},
paliKasnije: function(){
$.emajl();
if(window.location.pathname.length>2)  $('ul#navigacija>li>ul>li>a[href$="'+location.pathname.substring(1).substring(location.pathname.substring(1).lastIndexOf("/")+1)+'"]').addClass("trenutnaStranica");
$.navigacijaTipkovnica();

},
podnozje: function(ispisi,vrh){	// podnozje teksta print 0/1,vrh 0/1,jezik:0=hr 1=en
var jezik,HaTeeMeL='<span style="float:left;"><a href="javascript:window.print();">';
(window.location.href.indexOf("-en.")!=-1) ? jezik=1 : jezik=0;
(ispisi && !jezik) ? HaTeeMeL+="ispiši" : HaTeeMeL+=" ";
(ispisi && jezik==1) ? HaTeeMeL+="print" : HaTeeMeL+=" ";
HaTeeMeL+='</a></span><span style="float:right;"><a href="#">';
(vrh && !jezik) ? HaTeeMeL+="na vrh" : HaTeeMeL+=" ";
(vrh && jezik==1) ? HaTeeMeL+="top" : HaTeeMeL+=" ";
HaTeeMeL+='</a></span>';
$("div#podSredina").append(HaTeeMeL);},
zadnjaPromjena: function(){	// document.lastModified transformacija
if (Date.parse(document.lastModified) != 0) {
var datum = new Date(document.lastModified);
var kojiDan = new Array("Nedilja","Ponediljak","Utorak","Srida","Četvrtak","Petak","Subota");
var minute = datum.getMinutes();
var HaTeeMeL="";
minute<10 ? minute="0"+datum.getMinutes() : minute=datum.getMinutes();
if(window.location.href.indexOf("-en.")==-1) HaTeeMeL+=(kojiDan[datum.getDay()]+", ");
HaTeeMeL+=(datum.getDate()+". "+(datum.getMonth()+1)+". "+datum.getFullYear()+". ");
HaTeeMeL+=(datum.getHours()+":"+minute+"&nbsp;");}
$("div#podLivo>div#datum").append(HaTeeMeL);},
navigacijaPoNaslovima: function(){	// dodaje navigaciju po naslovima na stranici
if ($("h1,h2,h3").length>2){
var naslovi="";
$("h1:gt(0),h2,h3").each(function(){$(this).addClass("q")});
$(".q").each(function(i){
	naslovi+="<li><a href='#q"+i+"'>"+$(this).text()+"</a></li>";
	$(this).prepend("<a name=q"+i+"></a>");});
(document.location.href.indexOf("-en.htm")==-1) ? naslovi="na ovoj stranici:"+naslovi : naslovi="on this page:"+naslovi;
$("#livo").append("<ul id='sazetak'>"+naslovi+"</ul>");
$("#sazetak").hover(function(){$(this).css("opacity",1).children().fadeIn()},
					  function(){$(this).css("opacity",0.2).children().fadeOut()});};},
navigacijaTipkovnica: function(){	// dodaje navigaciju na tipkovnici
$("#zagLivo>a").blur(function(){$("#navigacija>li:first>ul").slideDown(300);$("#navigacija>li:first>ul>li:first>a").focus();});
$("#navigacija>li:eq(0)>ul>li:last>a").blur(function(){$("#navigacija>li:eq(0)>ul").slideUp(300);$("#navigacija>li:eq(1)>ul").slideDown(300);$("#navigacija>li:eq(1)>ul>li:first>a").focus();});
$("#navigacija>li:eq(1)>ul>li:last>a").blur(function(){$("#navigacija>li:eq(1)>ul").slideUp(300);$("#navigacija>li:eq(2)>ul").slideDown(300);$("#navigacija>li:eq(2)>ul>li:first>a").focus();});
$("#navigacija>li:eq(2)>ul>li:last>a").blur(function(){$("ul#navigacija>li:eq(2)>ul").slideUp(300);});},
emajl: function(){  // <a class="emajl" href="user_nameATdomain">tekst linka</a> >>> mailto:user_name@domain
$("a.emajl").each(function(){
$(this).attr("href",$(this).attr("href").replace(/([^A]+)AT([\w]+)/,"mailto:$1@$2"));
if(!$(this).text()) $(this).text($(this).attr("href").substr(7));
});},
debag: function(msg,rplc){ // funkcija za debugiranje skripti, rplc -> zamjena poruke
 rplc ? $("#zagSredina").empty().append(msg) : $("#zagSredina").append(msg);},
engleski: function(){ // koji je jezik, POZIVATI KAO if($.engleski())...
if(window.location.href.indexOf("-en.")==-1) return 0;else return 1;}
// testis zona, dodaj zarez prije nove funkcije
});
