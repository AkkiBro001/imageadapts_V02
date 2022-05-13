//SIZE VARIABLES
let heightRatio = null;
const RangeDefaultValue = 100;
const CTAbtnSource = './images';

let isNotiActive = true;

let imageTray = []

let scalingType = undefined;

let canvasDefaultSize = [1024, 512]
const maxScale = 2048;


const cornerTextDetails = {
    fontName: 'gotham',
    fontSize: '23px',
    fontWeight: 'bold',
    fontColor: 'white',
    textAlign: 'right'
}

//Canvas Image
let imgData = [];


let TotalImage = 0;


let lastUsedScaleMethod = null; //scaletoFit OR scaletoFill

let savefileName = '';
let ACTIVE_MENU = null;

//DOM-imgSet
const DOMImageSet = document.querySelectorAll(".DOM-imgSet img")

//NEVIGATION MENUS
const navMenu = document.querySelectorAll(".nav-menu")

//BUTTONS VARIABLE
const addImg = document.querySelector('.addImg');
const removeImg = document.querySelector('.removeImg');
const previewBtn = document.querySelector('.previewBtn')
const scaleToFitBtn = document.querySelector('#scaleToFit')
const restBTN = document.querySelector('#reset-btn')
const exportBtn = document.querySelector('#exportBtn')


//INPUTS
const imageSelect = document.querySelector('.imageSelect');
const ctaContainer = document.querySelector('.cta')
const ctaDrop = ctaContainer.querySelector("#cta");
const browseFile = document.querySelector('#browseFile')
const errorMsg = document.querySelector('.errorBrowse')
const copySelect = document.querySelector('#copySelect')
const cornerText = document.querySelector('#cornerText')
const notiSize = document.querySelector('#notiSize')
const extentions = document.querySelector('.extentions')

//INPUT RANGE
const xRange = document.querySelector("#x-range")
const yRange = document.querySelector("#y-range")
const scaleRange = document.querySelector("#scale-range")
const qualityRange = document.querySelector("#quality-range")
const canvasClr = document.querySelector("#canvasClr")
const fileSize = document.querySelector('.fileSize')


//INPUT RANGE INDICATOR
const xPointZERO = document.querySelector(".x-pointZERO")
const yPointZERO = document.querySelector(".y-pointZERO")
const scaleZERO = document.querySelector(".scaleZERO")
const quality = document.querySelector(".quality")

//CANVAS
const actualImg = document.querySelector('#actualImg')
const actualImgCTX = actualImg.getContext('2d')
const previewImg = document.querySelector('#previewImg')
const imageContainer = document.querySelector('.image-container')



window.addEventListener('resize', () => {
    if (heightRatio) {

        imageContainer.style.width = `${imageContainer.parentElement.offsetWidth}px`;
        imageContainer.style.height = `${imageContainer.parentElement.offsetWidth * heightRatio}px`;

    }

    if (document.querySelector('.guides')) {

        document.querySelector('.guides').style.height = `${imageContainer.offsetHeight * 0.3583333333333333}px`
    }
})








//CTA Buttons
const CTA = [
    'Watch-Now.png',
    'Coming-Soon',
    'Bengali.png',
    'Gujarati.png',
    'Hindi.png',
    'Kannada.png',
    'Live-Now.png',
    'Malayalam.png',
    'Marathi.png',
    'Play-Now.png',
    'Punjabi.png',
    'Read-Now.png',
    'Start-Watching.png',
    'Subscribe-Now',
    'Tamil.png',
    'Telugu.png',
    'Watch-Live-News-Updates.png',
    'Watch-Live.png',
    'Play.png'
]


//!Event Listner ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//!01 Handle CTA Copy (Right Bottom Corner)
copySelect.addEventListener('change', (e) => {
    if (e.target.value == 'only-gradient') {
        cornerText.classList.remove('hideImageInputs')
    } else {
        cornerText.classList.add('hideImageInputs')
    }
})


//!02 Change Canvas Background color
canvasClr.addEventListener('change', (e) => {
    actualImg.style.background = e.target.value;
    imageContainer.style.background = e.target.value;
})


//!03 Image Browse Event
browseFile.addEventListener('change', (e) => {
    if (e.target.files.length > 3) {
        alert('Please select files should be 3 max')
        window.location.reload()
    }
})



//!04 Preview Image Click
previewBtn.addEventListener('click', () => {
    if (browseFile.files.length > 0) {
        imageTray = [];
        updateImageSelect()
        loadCanvas()
    } else {
        alert('Please select files should be 3 max')
    }
})

//!05 Scale to Fit
// scaleToFitBtn.addEventListener('click', () => {
//     if (browseFile.files.length > 0) {
//         updateImageSelect()
//     } else {
//         alert('Please select files should be 3 max')
//     }
// })

//!06. Input Range Update
// xRange.addEventListener('change', updateCanvas)
// yRange.addEventListener('change', updateCanvas)
// scaleRange.addEventListener('change', updateCanvas)
// qualityRange.addEventListener('change', updateCanvas)

navMenu.forEach((menu, index) => {
    menu.addEventListener('click', () => {

        if (index === 0) {
            menu.classList.add('active-menu')
            navMenu[1].classList.remove('active-menu')
        } else {
            menu.classList.add('active-menu')
            navMenu[0].classList.remove('active-menu')
        }

        activeMenu()

    })
})

//!08 Notification Size
notiSize.addEventListener('change', setCanvas)


//!06. Input Range Update
xRange.addEventListener('change', updateCanvas)
yRange.addEventListener('change', updateCanvas)
scaleRange.addEventListener('change', updateCanvas)
qualityRange.addEventListener('change', updateCanvas)
imageSelect.addEventListener('change', updateInputs)

//!07. Input Range Update
exportBtn.addEventListener('click', () => {
    if(imageTray.length === 0) return
    if(extentions.value == 'jpeg'){

        exportImg(Number(qualityRange.value), 'image/jpeg')
    }else{
        exportImg(Number(qualityRange.value), 'image/png')

    }
})


//!Functions ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function activeMenu() {
    navMenu.forEach((menu, index) => {

        if (Array.from(menu.classList).includes('active-menu') && index === 0) {
            ctaContainer.classList.remove('hideImageInputs')
            const CanvasSize = notiSize.value.split('x').map(val => Number(val))
            ctaDrop.innerHTML = ""
            CTA.forEach((ctaBtn) => {
                ctaDrop.innerHTML += `<option value='${ctaBtn.replace(/.png/g, '')}'>${ctaBtn.replace(/.png/g, '').replace(/-/g, ' ')}</option>`
            })
            notiSize.classList.remove('hideImageInputs')
            ACTIVE_MENU = 'Notification'
        } else if (Array.from(menu.classList).includes('active-menu') && index === 1) {
            ctaContainer.classList.add('hideImageInputs')
            notiSize.classList.add('hideImageInputs')
            ACTIVE_MENU = 'Banners'
        }
    })
}



function updateImageSelect() {
    imageSelect.innerHTML = '';
    Array.from(browseFile.files).forEach((_, index) => {
        imageSelect.innerHTML += `<option value="IMG-${index + 1}" data-img="img${index + 1}">IMG ${index + 1}</option>`
    })

}


function setCanvas() {
    if (ACTIVE_MENU === 'Notification') {
        activeMenu()
        let guides = document.createElement('div')
        let NotificationSize = notiSize.value.split('x').map(val => Number(val))
        heightRatio = NotificationSize[1] / NotificationSize[0]

        imageContainer.style.width = `${imageContainer.parentElement.offsetWidth}px`;
        imageContainer.style.height = `${imageContainer.parentElement.offsetWidth * heightRatio}px`;

        actualImg.width = NotificationSize[0];
        actualImg.height = NotificationSize[1];

        if (NotificationSize[0] == 800) {
            if (document.querySelector('.guides')) {
                document.querySelector('.guides').remove()
            }


            guides.style.width = `${imageContainer.offsetWidth + 20}px`
            guides.style.height = `${imageContainer.offsetHeight * 0.3583333333333333}px`
            guides.style.border = `3px dashed cyan`;
            guides.style.position = `absolute`;
            guides.style.left = `50%`;
            guides.style.top = `50%`;
            guides.style.transform = 'translate(-50%, -50%)';
            guides.classList.add('guides')
            imageContainer.append(guides)

        } else {
            if (document.querySelector('.guides')) {
                document.querySelector('.guides').remove()
            }
        }
    }
}

//!1. Check Onload Event
window.onload = function () {
    activeMenu()
    setCanvas()
}

function updateCanvas(){
    if(imageTray.length === 0) return

    function updates(index){
        imageTray[index].x = Math.round(((Number(xRange.value) - 100) / 100) * imageTray[index].canvas.width);
        
        xPointZERO.innerHTML = `${xRange.value-100}%`
        imageTray[index].y = Math.round(((Number(yRange.value) - 100) / 100) * imageTray[index].canvas.height);
        yPointZERO.innerHTML = `${yRange.value-100}%`
        const ratio = imageTray[index].height / imageTray[index].width;
        imageTray[index].width = Math.round((Number(scaleRange.value) / 100) * maxScale);
        imageTray[index].height = imageTray[index].width * ratio;
        scaleZERO.innerHTML = `${scaleRange.value}%`
        ReDraw(imageTray)
    }

    if(imageSelect.value == 'IMG-1'){
        updates(0)
    }else if(imageSelect.value == 'IMG-2'){
        
        updates(1)
        
    }else{
        updates(2)
    }
    checkFileSize()
}

async function ReDraw(data){

  
    data.forEach((ele, _) => {
        const {img, canvas, x, y, width, height} = ele
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width,canvas.height)
        ctx.drawImage(img, x, y, width, height)
    })

    if(data.length === 2){
        loadSplitCanvas([data[0].canvas, data[1].canvas])
    }else if(data.length === 3) {
        loadSplitCanvas([data[0].canvas, data[1].canvas, data[2].canvas])

    }
    await loadCopy(actualImg)
    await loadCTA(actualImg)
    await loadPreviewImage(actualImg)
}




function scaleToFill(img, canvas) {
    
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    const width = img.width * scale;
    const height = img.height * scale
    ctx.drawImage(img, x, y, width, height)

    imageTray.push({ img, canvas, scale, x, y, width, height })
}


function loadCopy(canvas) {

    return new Promise((resolve, reject) => {
        if (copySelect.value === 'only-gradient') {
            const ctx = canvas.getContext('2d')
            const CSize = document.querySelector('#notiSize')
            const gradient = `${CTAbtnSource}/${copySelect.value}_${CSize.value}.png`
            const grady = new Image()
            grady.src = gradient;

            grady.onload = function () {

                ctx.drawImage(grady, 0, 0, canvas.width, canvas.height)
                ctx.font = `${cornerTextDetails.fontWeight} ${cornerTextDetails.fontSize} ${cornerTextDetails.fontName}`;
                ctx.fillStyle = `${cornerTextDetails.fontColor}`;
                ctx.textAlign = `${cornerTextDetails.textAlign}`;
                ctx.fillText(cornerText.value, actualImg.width - 25, actualImg.height - 25);
                resolve()
            }
        } else if (copySelect.value === 'BCCI-Courtsey') {
            const ctx = canvas.getContext('2d')
            const CSize = document.querySelector('#notiSize')
            const BCCI = `${CTAbtnSource}/${copySelect.value}_${CSize.value}.png`
            const grady = new Image()
            grady.src = BCCI;

            grady.onload = function () {

                ctx.drawImage(grady, 0, 0, canvas.width, canvas.height)

                resolve()
            }
        } else {
            resolve()
        }

    })


}

function loadCTA(canvas) {
    return new Promise((resolve, reject) => {
        let CTA;
        const ctx = canvas.getContext('2d')
        const CSize = document.querySelector('#notiSize')
        if(CSize.value === '1024x512'){

            CTA = `${CTAbtnSource}/${ctaDrop.value}_${CSize.value}.png`
        }else if(CSize.value === '640x320'){
            CTA = `${CTAbtnSource}/${ctaDrop.value}_1024x512.png`
        }else{
            CTA = `${CTAbtnSource}/${ctaDrop.value}_${CSize.value}.png`
        }
        const grady = new Image()
        grady.src = CTA;
        
        grady.onload = function () {

            ctx.drawImage(grady, 0, 0, canvas.width, canvas.height)

            resolve()
        }
    })
}


function loadPreviewImage(canvas){
    return new Promise((resolve,reject) => {
        previewImg.style.display = 'block';
        previewImg.src = canvas.toDataURL('image/jpeg', 0.5);
        previewImg.onload = function(){
            resolve()
        }
    })
}

function checkFileSize(){
    if(extentions.value == 'jpeg'){
        actualImg.toBlob(function(blob) {
            fileSize.innerHTML = `(${(blob.size / actualImg.width).toFixed(2)}kb)`;
        }, "image/jpeg", (Number(qualityRange.value) / 100));
    }else{
        fileSize.innerHTML = 'N/A'
    }
    
}

function updateInputs(){
    
    function updates(data){
        xRange.value = (data.x / data.canvas.width) * 100 + 100;
        xPointZERO.innerHTML = `${xRange.value-100}%`

        yRange.value = (data.y / data.canvas.height) * 100 + 100;
        yPointZERO.innerHTML = `${yRange.value-100}%`

        scaleRange.value = Math.round((data.width / maxScale)* 100)
        
        scaleZERO.innerHTML = `${Math.round((data.width / maxScale)* 100)}%`
    }

    if(imageSelect.value == 'IMG-1'){
        updates(imageTray[0])
    }else if(imageSelect.value == 'IMG-2'){
        updates(imageTray[1])
    }else {
        updates(imageTray[2])
    }

    checkFileSize()
}


function loadSplitCanvas(canvas){
    if(canvas.length === 2){
        actualImgCTX.clearRect(0, 0, actualImg.width, actualImg.height)
        const setCanvas1 = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = canvas[0].toDataURL()
            img.onload = function(){
                actualImgCTX.drawImage(img, 0, 0, canvas[0].width, canvas[0].height)
                resolve()
            }
        })

        const setCanvas2 = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = canvas[1].toDataURL()
            img.onload = function(){
                actualImgCTX.drawImage(img, canvas[1].width, 0, canvas[1].width, canvas[1].height)
                resolve()
            }
        })

        return Promise.all([setCanvas1, setCanvas2])
    }else if(canvas.length === 3){
        actualImgCTX.clearRect(0, 0, actualImg.width, actualImg.height)
        const setCanvas1 = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = canvas[0].toDataURL()
            img.onload = function(){
                actualImgCTX.drawImage(img, 0, 0, canvas[0].width, canvas[0].height)
                resolve()
            }
        })

        const setCanvas2 = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = canvas[1].toDataURL()
            img.onload = function(){
                actualImgCTX.drawImage(img, canvas[1].width, 0, canvas[1].width, canvas[1].height)
                resolve()
            }
        })

        const setCanvas3 = new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = canvas[2].toDataURL()
            img.onload = function(){
                actualImgCTX.drawImage(img, canvas[2].width * 2, 0, canvas[2].width, canvas[2].height)
                resolve()
            }
        })

        return Promise.all([setCanvas1, setCanvas2, setCanvas3])
    }
}

//!2. Image Load
function loadCanvas() {
    //?1. Read Browsefile Images
    function ReadFiles() {
        if (browseFile.files.length === 1) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                let read = new FileReader()
                read.onload = function () {
                    img.src = read.result;
                    img.onload = function () {

                        resolve([img])
                    }
                }
                read.readAsDataURL(browseFile.files[0])
            })
        } else if (browseFile.files.length === 2) {
            const p1 = new Promise((resolve, reject) => {
                const img = new Image();
                let read = new FileReader()
                read.onload = function () {
                    img.src = read.result;
                    img.onload = function () {

                        resolve(img)
                    }
                }
                read.readAsDataURL(browseFile.files[0])
            })

            const p2 = new Promise((resolve, reject) => {
                const img = new Image();
                let read = new FileReader()
                read.onload = function () {
                    img.src = read.result;
                    img.onload = function () {

                        resolve(img)
                    }
                }
                read.readAsDataURL(browseFile.files[1])
            })

            return Promise.all([p1, p2])
        } else {
            const p1 = new Promise((resolve, reject) => {
                const img = new Image();
                let read = new FileReader()
                read.onload = function () {
                    img.src = read.result;
                    img.onload = function () {

                        resolve(img)
                    }
                }
                read.readAsDataURL(browseFile.files[0])
            })

            const p2 = new Promise((resolve, reject) => {
                const img = new Image();
                let read = new FileReader()
                read.onload = function () {
                    img.src = read.result;
                    img.onload = function () {

                        resolve(img)
                    }
                }
                read.readAsDataURL(browseFile.files[1])
            })

            const p3 = new Promise((resolve, reject) => {
                const img = new Image();
                let read = new FileReader()
                read.onload = function () {
                    img.src = read.result;
                    img.onload = function () {

                        resolve(img)
                    }
                }
                read.readAsDataURL(browseFile.files[2])
            })

            return Promise.all([p1, p2, p3])
        }
    }

    

    //?2. Draw Canvas / Split
    function Draw(files) {
        actualImgCTX.clearRect(0, 0, actualImg.width, actualImg.height)
        if (files.length === 1) {
            return new Promise((resolve, reject) => {

                scaleToFill(files[0], actualImg)
                resolve(actualImg)
            })

        }else if(files.length === 2){
            return new Promise((resolve, reject) => {
                const canvas1 = document.createElement('canvas')
                canvas1.width = actualImg.width / files.length;
                canvas1.height = actualImg.height;

                const canvas2 = document.createElement('canvas')
                canvas2.width = actualImg.width / files.length;
                canvas2.height = actualImg.height;

                scaleToFill(files[0], canvas1)
                scaleToFill(files[1], canvas2)
                
                resolve([canvas1, canvas2])
            })
        }else if(files.length === 3){
            return new Promise((resolve, reject) => {
                const canvas1 = document.createElement('canvas')
                canvas1.width = actualImg.width / files.length;
                canvas1.height = actualImg.height;

                const canvas2 = document.createElement('canvas')
                canvas2.width = actualImg.width / files.length;
                canvas2.height = actualImg.height;

                const canvas3 = document.createElement('canvas')
                canvas3.width = actualImg.width / files.length;
                canvas3.height = actualImg.height;

                scaleToFill(files[0], canvas1)
                scaleToFill(files[1], canvas2)
                scaleToFill(files[2], canvas3)
                
                resolve([canvas1, canvas2, canvas3])
            })
        }
    }


    //?Main Function
    async function Main() {
        //*1. Read Browsefile Images
        const ReadBrowseFile = await ReadFiles()
        const splitCanvas = await Draw(ReadBrowseFile)
        await loadSplitCanvas(splitCanvas)
        await loadCopy(actualImg)
        await loadCTA(actualImg)
        await loadPreviewImage(actualImg)
        updateInputs()
    }
    Main()



    


    


}


function exportImg(quality = 50, type){
    //CHROME ONLY
        let link = document.createElement("a");
        
        link.download = browseFile.files[0].name.replace('.jpg','');
        
        if(type.indexOf('jpeg') > -1){
            actualImg.toBlob(function(blob) {
        
                link.href = URL.createObjectURL(blob);
                link.click();
                }, type, (quality / 100));
        }else{
            actualImg.toBlob(function(blob) {
        
                link.href = URL.createObjectURL(blob);
                link.click();
                }, type);
        }
        


      
}

