import {Directive, ElementRef, Input,Renderer2,AfterViewChecked} from '@angular/core';

@Directive({
    selector: '[ellipsistext]'
})
export class EllipsisDirective  implements AfterViewChecked{

    @Input() ellipsistext:string ;
    @Input() lines:number = 0;
    @Input() height:number = 0;
    @Input() defaultHeight:number = 0;
    @Input() cssClass:string = "";

    constructor(private ele:ElementRef,private renderer: Renderer2){}



    ngAfterViewChecked(){
        this.removeAttributes();
        this.breakWords();
    }

    breakWords(){

        var current = this.ele.nativeElement,
            text = this.ellipsistext,
            words = (typeof text == "string" && text.split(' ')) || [],
            height = this.height,
            wordList:any= [];

        if(words.length<=0){
            current.innerText = "";
        }else{
            wordList.push(words[0]);
            current.innerText = words[0];
        }

        for(var i = 1; i < words.length; i++) {
            //current.offsetHeight >= height
            if ( (height && current.offsetHeight >= height) || ( this.lines && this.getRows(current) == this.lines+1 ) ) {
                height = current.offsetHeight;
                let newWordList = wordList.slice(0),
                    trimmedText = "";
                if(i>=2){
                    trimmedText = newWordList.slice(0,i-1).join(" ");
                    current.innerText = trimmedText + "...";

                    if(current.offsetHeight >= height){
                        trimmedText = newWordList.slice(0,i-2).join(" ");
                        current.innerText = trimmedText + "...";
                    }
                }else{
                    current.innerText ="...";
                }
                break;
            }else{
                wordList.push(words[i]);
                current.innerText = (current.innerText + ' ' + words[i]);
            }
        }
        this.setAttributes();
    }

    getRows(selector:any=null) {
        let style =  window.getComputedStyle(selector, null),
            height = parseInt(style.getPropertyValue("height")),
            line_height = parseInt(style.getPropertyValue("line-height")),
            rows = height / line_height;

        return Math.round(rows);
    }

    setAttributes(){
        this.cssClass && this.renderer.addClass(this.ele.nativeElement,this.cssClass);
        this.defaultHeight && this.renderer.setStyle(this.ele.nativeElement,'height',`${this.defaultHeight}px`);

    }

    removeAttributes(){
        this.cssClass && this.renderer.removeClass(this.ele.nativeElement,this.cssClass);
        this.defaultHeight && this.renderer.removeStyle(this.ele.nativeElement,'height');
    }

}
