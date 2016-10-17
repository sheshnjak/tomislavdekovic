/*!
	Slimbox v2.04 - The ultimate lightweight Lightbox clone for jQuery
	(c) 2007-2010 Christophe Beyls <http://www.digitalia.be>
	MIT-style license.
	
	ADDITIONS BY  ..:: sheshnjak ::..
197(143)	images[activeImage][1]=images[activeImage][1].replace(/([^:]+)(: )([^$]+)/,'<a href="'+activeURL+'">$1</a><div>$3</div>');	// divides caption into name: caption
252(189)	if($("html").attr("lang")=="hr-HR") $("#lbCloseLink").text("zatvori").attr("title","Za zatvaranje klikni na tamno polje izvan slike.");	// replaces close image with localized text
			else $("#lbCloseLink").text("close").attr("title","Click on dark area to close.");
*/
(function($){
var win=$(window),options,images,activeImage=-1,activeURL,prevImage,nextImage,compatibleOverlay,middle,centerWidth,centerHeight,
ie6=!window.XMLHttpRequest,hiddenElements=[],documentElement=document.documentElement,
preload={},preloadPrev=new Image(),preloadNext=new Image(),
overlay,center,image,sizer,prevLink,nextLink,bottomContainer,bottom,caption,number;
$(function(){
$("body").append(
$([
overlay=$('<div id="lbOverlay" />')[0],
center=$('<div id="lbCenter" />')[0],
bottomContainer=$('<div id="lbBottomContainer" />')[0]
]).css("display","none")
);
image=$('<div id="lbImage" />').appendTo(center).append(
sizer=$('<div style="position: relative;" />').append([
prevLink=$('<a id="lbPrevLink" href="#" />').click(previous)[0],
nextLink=$('<a id="lbNextLink" href="#" />').click(next)[0]
])[0]
)[0];
bottom=$('<div id="lbBottom" />').appendTo(bottomContainer).append([
$('<a id="lbCloseLink" href="#" />').add(overlay).click(close)[0],
caption=$('<div id="lbCaption" />')[0],
number=$('<div id="lbNumber" />')[0],
$('<div style="clear: both;" />')[0]
])[0];
});
$.slimbox=function(_images,startImage,_options){
options=$.extend({
loop:false,
overlayOpacity:0.8,
overlayFadeDuration:400,
resizeDuration:400,
resizeEasing:"swing",
initialWidth:250,
initialHeight:250,
imageFadeDuration:400,
captionAnimationDuration:400,
counterText:"{x} / {y}",
closeKeys:[27,88,67],
previousKeys:[37,80],
nextKeys:[39,78]
},_options);
if(typeof _images=="string"){
_images=[[_images,startImage]];
startImage=0;
}
middle=win.scrollTop()+(win.height()/2);
centerWidth=options.initialWidth;
centerHeight=options.initialHeight;
$(center).css({top:Math.max(0,middle-(centerHeight/2)),width:centerWidth,height:centerHeight,marginLeft:-centerWidth/2}).show();
compatibleOverlay=ie6||(overlay.currentStyle&&(overlay.currentStyle.position!="fixed"));
if(compatibleOverlay)overlay.style.position="absolute";
$(overlay).css("opacity",options.overlayOpacity).fadeIn(options.overlayFadeDuration);
position();
setup(1);
images=_images;
options.loop=options.loop&&(images.length>1);
return changeImage(startImage);
};
$.fn.slimbox=function(_options,linkMapper,linksFilter){
linkMapper=linkMapper||function(el){
return[el.href,el.title];
};
linksFilter=linksFilter||function(){
return true;
};
var links=this;
return links.unbind("click").click(function(){
var link=this,startIndex=0,filteredLinks,i=0,length;
filteredLinks=$.grep(links,function(el,i){
return linksFilter.call(link,el,i);
});
for(length=filteredLinks.length;i<length;++i){
if(filteredLinks[i]==link)startIndex=i;
filteredLinks[i]=linkMapper(filteredLinks[i],i);
}
return $.slimbox(filteredLinks,startIndex,_options);
});
};
function position(){
var l=win.scrollLeft(),w=win.width();
$([center,bottomContainer]).css("left",l+(w/2));
if(compatibleOverlay)$(overlay).css({left:l,top:win.scrollTop(),width:w,height:win.height()});
}
function setup(open){
if(open){
$("object").add(ie6?"select":"embed").each(function(index,el){
hiddenElements[index]=[el,el.style.visibility];
el.style.visibility="hidden";
});
}else{
$.each(hiddenElements,function(index,el){
el[0].style.visibility=el[1];
});
hiddenElements=[];
}
var fn=open?"bind":"unbind";
win[fn]("scroll resize",position);
$(document)[fn]("keydown",keyDown);
}
function keyDown(event){
var code=event.keyCode,fn=$.inArray;
return(fn(code,options.closeKeys)>=0)?close()
:(fn(code,options.nextKeys)>=0)?next()
:(fn(code,options.previousKeys)>=0)?previous()
:false;
}
function previous(){
return changeImage(prevImage);
}
function next(){
return changeImage(nextImage);
}
function changeImage(imageIndex){
if(imageIndex>=0){
activeImage=imageIndex;
activeURL=images[activeImage][0];
prevImage=(activeImage||(options.loop?images.length:0))-1;
nextImage=((activeImage+1)%images.length)||(options.loop?0:-1);
stop();
center.className="lbLoading";
preload=new Image();
preload.onload=animateBox;
preload.src=activeURL;
}
return false;
}
function animateBox(){
center.className="";
$(image).css({backgroundImage:"url("+activeURL+")",visibility:"hidden",display:""});
$(sizer).width(preload.width);
$([sizer,prevLink,nextLink]).height(preload.height);
images[activeImage][1]=images[activeImage][1].replace(/([^:]+)(: )([^$]+)/,'<a href="'+activeURL+'">$1</a><div>$3</div>');
$(caption).html(images[activeImage][1]||"");
$(number).html((((images.length>1)&&options.counterText)||"").replace(/{x}/,activeImage+1).replace(/{y}/,images.length));
if(prevImage>=0)preloadPrev.src=images[prevImage][0];
if(nextImage>=0)preloadNext.src=images[nextImage][0];
centerWidth=image.offsetWidth;
centerHeight=image.offsetHeight;
var top=Math.max(0,middle-(centerHeight/2));
if(center.offsetHeight!=centerHeight){
$(center).animate({height:centerHeight,top:top},options.resizeDuration,options.resizeEasing);
}
if(center.offsetWidth!=centerWidth){
$(center).animate({width:centerWidth,marginLeft:-centerWidth/2},options.resizeDuration,options.resizeEasing);
}
$(center).queue(function(){
$(bottomContainer).css({width:centerWidth,top:top+centerHeight,marginLeft:-centerWidth/2,visibility:"hidden",display:""});
$(image).css({display:"none",visibility:"",opacity:""}).fadeIn(options.imageFadeDuration,animateCaption);
});
}
function animateCaption(){
if(prevImage>=0)$(prevLink).show();
if(nextImage>=0)$(nextLink).show();
$(bottom).css("marginTop",-bottom.offsetHeight).animate({marginTop:0},options.captionAnimationDuration);
bottomContainer.style.visibility="";
}
function stop(){
preload.onload=null;
preload.src=preloadPrev.src=preloadNext.src=activeURL;
$([center,image,bottom]).stop(true);
$([prevLink,nextLink,image,bottomContainer]).hide();
}
function close(){
if(activeImage>=0){
stop();
activeImage=prevImage=nextImage=-1;
$(center).hide();
$(overlay).stop().fadeOut(options.overlayFadeDuration,setup);
}
return false;
}
})(jQuery);
if(!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)){
jQuery(function($){
$("a[rel^='lbx']").slimbox({overlayOpacity:0.9},null,function(el){
return(this==el)||((this.rel.length>8)&&(this.rel==el.rel));
});
if($("html").attr("lang")=="hr-HR") $("#lbCloseLink").text("zatvori").attr("title","Za zatvaranje klikni na tamno polje izvan slike.");
else $("#lbCloseLink").text("close").attr("title","Click on dark area to close.");
});
}
