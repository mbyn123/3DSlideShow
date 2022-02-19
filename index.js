import source from './data.js'

let container = document.querySelector('#container'),
    wrapper = document.querySelector('.wrapper'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    slides = [];

// 当前项    
let step = 1,
    timer = null;

// 自动轮播
const automove = () => {
    timer = setInterval(() => {
        step++;
        if (step > source.length - 1) {
            step = 0
        }
        render()
    }, 2000);
}



// 延迟函数
const delay = function (interval) {
    if (typeof interval === 'undefined') {
        interval = 1000
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}

// 数据渲染
const render = (intal) => {
    let str = ``,
        len = source.length;

    // 控制slide样式
    let temp1 = step - 2, // 3
        temp2 = step - 1, // 4
        temp3 = step, // 0
        temp4 = step + 1, // 2
        temp5 = step + 2; // 3

    if (temp1 < 0) {
        temp1 = len + temp1
    }
    if (temp2 < 0) {
        temp2 = len + temp2
    }
    if (temp4 > len - 1) {
        temp4 = temp4 - len
    }
    if (temp5 > len - 1) {
        temp5 = temp5 - len
    }

    source.forEach((item, index) => {
        let transform = 'translate(-50%,-50%) scale(0.55)',
            zIndex = 0,
            className = 'slide';
        switch (index) {
            case temp3:
                transform = 'translate(-50%,-50%) scale(1)'
                zIndex = 3
                className = 'slide active'
                break;
            case temp1:
                transform = 'translate(-195%,-50%) scale(0.7)'
                zIndex = 1
                className = 'slide'
                break;
            case temp2:
                transform = 'translate(-130%,-50%) scale(0.85)'
                zIndex = 2
                className = 'slide'
                break;
            case temp4:
                transform = 'translate(30%,-50%) scale(0.85)'
                zIndex = 2
                className = 'slide'
                break;
            case temp5:
                transform = 'translate(95%,-50%) scale(0.7)'
                zIndex = 1
                className = 'slide'
                break;
        }

        item.sty = `transform:${transform};z-index:${zIndex}`
        item.className = className
    })

    //非第一次执行，修改slide样式
    if (!intal) {
        source.forEach((item, index) => {
            let cur = slides[index]
            cur.style = item.sty
            cur.className = item.className
        })
        return
    }

    // 数据绑定
    source.forEach((item,index) => {
        let { pic, descript: { name, deram, hobby }, sty, className } = item
        str += `
        <div class="${className}" style='${sty}'>
            <img src="./${pic}" alt="" class="image">
            <div class="mark"></div>
            <p class="detail">
                <span>${name}</span>
                <span>梦想:${deram}</span>
                <span>喜欢的食物:${hobby}</span>
            </p>
        </div>
        `
    })

    wrapper.innerHTML = str
    slides = wrapper.querySelectorAll('.slide')

    for(let i=0;i<slides.length;i++){
        slides[i].onclick = ()=>{
            console.log(i)
            step = i
            render()
        }
    }
}

delay(500).then(() => {
    // 控制元素显示
    wrapper.style.opacity = 1

    // 保证获取的元素是5个
    // console.log(source.length)
    let diff = source.length - 5
    if (diff < 0) {
        // console.log(Math.abs(diff))
        diff = Math.abs(diff)
        source.slice(0, diff).forEach(item => {
            source.push({
                ...item,
                id: parseInt(source[source.length - 1].id + 1)
            })
        })
        console.log(source)
        // console.log(source.slice(0, diff))
    }

    // 数据渲染
    render(true)

    // 开启轮播
    automove()

    // 控制轮播的暂停、开始
    container.onmouseenter = () => clearInterval(timer)
    container.onmouseleave = () => automove()

    // 左右切换
    prev.onclick = throttle(() => {
        step--;
        if (step < 0) {
            step = source.length - 1
        }
        render()
    }, 500)

    next.onclick = throttle(() => {
        step++;
        if (step > source.length - 1) {
            step = 0
        }
        render()
    }, 500)
})


// 节流函数
const throttle = (fn, time) => {
    let t = null
    return function () {
        if (t) {
            return
        }
        t = setTimeout(() => {
            // fn.call(this);
            fn()
            t = null
        }, time)
    }
}