"use strict"

document.addEventListener("DOMContentLoaded", ()=>{

    function Product(name, author, price, sale, img, id){
        this.name = name;
        this.author = author;
        this.price = price;
        this.sale = sale;
        this.img = img;
        this.id = id;
        this.end_price = () => price*(100-sale)/100;
    }

    const bin = {
        product: [],
        addBin(product_){
            this.product.push(product_);
        },
        delete(product_){
            let ind = this.product.indexOf(product_);
            this.product.splice(ind, 1);            
        },
        sum(){
            let new_pr = this.product.map(item => item.end_price());
            let n = new_pr.reduce((sum, current) => sum + current, 0);
            return Number(n.toFixed(2));
        },
        count_name(a){
            for (let i = 0; i < this.product.length; i++ ){
                let copies = this.product.filter(item => a==item.name);                
                return copies.length;
            }
        }
    };

    let books = [
        new Product("Хоббит, или Туда и обратно", "Дж.Р.Р. Толкин", 800, 20, "https://cdn1.ozone.ru/s3/multimedia-u/6055023762.jpg", "hobbit"),
        new Product ("Властелин колец. Братство кольца", "Дж.Р.Р. Толкин", 1000, 10, "https://cdn2.static1-sima-land.com/items/4493970/0/700-nw.jpg", "ring-1"),
        new Product ("Властелин колец. Две крепости", "Дж.Р.Р. Толкин", 1500, 30, "https://cdn2.static1-sima-land.com/items/3599361/0/700-nw.jpg", "ring-2"),
        new Product ("Властелин колец. Возвращение короля", "Дж.Р.Р. Толкин", 700, 5, "https://cdn2.static1-sima-land.com/items/4493970/0/700-nw.jpg", "ring-3"),        
    ];

    let add = document.getElementById("add");  
    let main_bin = document.getElementById("main_bin");
    let div_find = document.querySelector(".find_card");    

    const inf_bin = () =>{
        document.getElementById("counter").innerHTML = bin.product.length;
        sum.innerHTML = bin.sum();
    }

    const add_delete_listener = (del, node) => {
        del.addEventListener("click", () => {node.remove();});
        inf_bin();
    }

    const add_show_listener = (shower, conteiner) => shower.addEventListener("click", () => {conteiner.style.display = "block";});    

    function add_scroll_down(add){      //скролит только до кнопки с формой
        let form = document.getElementById("new_card");
        add.addEventListener("click", () => {        
            let scroll = window.pageYOffset + form.getBoundingClientRect().top;
            window.scrollBy(0, scroll);
        });
    }

    function make_bin_card(conteiner, product){
        conteiner.insertAdjacentHTML("afterbegin",
            `<div class="book" id="${product.id}">
                <img src=${product.img} alt="book cover">
                <div class="a">
                    <h2>${product.name}</h2>
                    <h4>${product.author}</h4>
                </div>
                <div class="b">
                    <button class="remove"><img src="img/delete.png"></button>
                    <h3>${product.end_price()}</h3>
                </div>
            </div>`);        
    }

    const count_bin_card = (product) => {               
        let p = bin.product.find(item => item.name == product.name);        
        if (p != undefined){
            let b = document.getElementById(p.id).querySelector(".b");                     
            if(b.querySelectorAll("h3")[1] != undefined) {
                b.querySelectorAll("h3")[1].remove();
            }
            if (bin.count_name(product.name)>1){
                b.insertAdjacentHTML("beforeend", `<h3>(${bin.count_name(p.name)})`);
            }
        }
    }

    const del_bin = (b, product) => {
        b.addEventListener("click", () => {            
            bin.delete(product);
            inf_bin();
            count_bin_card(product);
            if ((bin.count_name(product.name) == undefined) || (bin.count_name(product.name) == 0)){
               document.getElementById(product.id).remove();
            }        
        }); 
    }

    const display_bin_card = (pr) => {    
        if (bin.count_name(pr.name)<=1){            
            pr.id += "_2";            
            make_bin_card(main_bin, pr);
            let card = document.getElementById(pr.id);
            del_bin(card.querySelector(".remove"), pr);            
            
        }else{  
            count_bin_card(pr);
        }
        inf_bin();
    }    

    const add_bin = (binButton, pr) => {        
        binButton.addEventListener("click", () => {            
            bin.addBin(pr);            
            display_bin_card(pr);
        });
    }
    
    const sort_card = (arr) =>{
        sort_list.addEventListener("click", () => {
            let value_sort_list = document.getElementById("sort_list").value;            
            switch(value_sort_list){
                case 'to_min_price':
                    arr.sort((a, b) => a.price - b.price);
                    break;
                case 'to_max_price':
                    arr.sort((a, b) => a.price - b.price).reverse();
                    break;
                case 'alphabet':
                    arr.sort( (a, b) => a.name.localeCompare(b.name)).reverse();
                    break;
                default:
                    arr.sort( (a, b) => a.name.localeCompare(b.name));
            }
        card_part.innerHTML = '';
        arr.forEach((item) => {display_cards(card_part, item);});
    });        
    }

    function display_cards(conteiner, product){
        if ((product.sale == undefined) || (product.sale == 0)){            
            conteiner.insertAdjacentHTML("afterbegin",
                `<div class="card" id=${product.id}>
                    <div class="img_book">
                        <img class="product" src="${product.img}" alt="">
                        <button class="delete"><img src="img/delete.png" alt=""></button>
                    </div>
                    <h2>${product.name}</h2>
                    <h3>${product.author}</h3>                 
                    <h2>Цена: ${product.price}</h2>
                    <button class="bin"><img src="img/bin.png" alt=""></button>
                </div>`
            );
        }else{
            conteiner.insertAdjacentHTML("afterbegin",
            `<div class="card" id=${product.id}>
                <div class="img_book">
                    <img class="product" src="${product.img}" alt="">
                    <button class="delete"><img src="img/delete.png" alt=""></button>
                </div>
                <h2>${product.name}</h2>
                <h3>${product.author}</h3>
                <div class="price">
                    <h3>Цена: ${product.price}</h3>
                    <h3>Скидка: ${product.sale}%</h3>
                </div>
                <div class="price">
                    <h2>Итоговая цена: ${product.end_price()}</h2>
                </div>
                    <button class="bin"><img src="img/bin.png" alt=""></button>
            </div>`
        );
        }
        add_delete_listener(document.querySelector(".delete"), document.querySelector(".card"));
        add_bin(document.querySelector(".bin"), product);
    }

    const search = (arr) =>{        //доделать срабатывание при нажатии на enter
        search_b.addEventListener("click", () => {
            let finded = arr.filter(product => product.name.indexOf(search_input.value) != -1);            
            if (finded.length == 0){
                finded = arr.filter(product => product.author.indexOf(search_input.value) != -1);                
                div_find.innerHTML = '';
                finded.forEach(find_card => {
                    let j = arr.indexOf(find_card, 0);                    
                    display_cards(div_find, arr[j]);
                });
            }else{                    
                div_find.innerHTML = '';                               
                finded.forEach(find_card => {
                    let i = arr.indexOf(find_card, 0);                    
                    display_cards(div_find, arr[i]);
                });                          
            }
        });
    }

    search(books);
    sort_card(books);
    
    books.forEach((book) => {display_cards(card_part, book);});

    add_show_listener(document.getElementById("Bin"), document.getElementById("bin_part"));
    add_show_listener(add, document.getElementById("new_card"));
    add_scroll_down(add);

    addCard.addEventListener("click", () => {
        let r;        
        let c_id = f_name.value.replace(/ /g,'_');
        let res = books.filter(item => item.name == f_name.value);
        c_id += res.length;
        let card = new Product(f_name.value, f_author.value, f_cost.value, f_sale.value, f_img.value, c_id);

        books.forEach((book) => {
            if(JSON.stringify(book) == JSON.stringify(card)){
                alert("Такая карточка уже существует");
                r = 0;            
            }
        });    

        if (r != 0){
            if ((f_cost.value/1 != Math.abs(f_cost.value)) || (f_sale.value/1 != Math.abs(f_sale.value)) || (f_sale.value>99) || (f_name.value == "") ||(f_author.value == "")){
                alert("Введите корректное значение");           
            } else{
                display_cards(document.getElementById("card_part"), card);
                let b = document.getElementById(card.id);
            
                if (f_sale.value==0){
                    b.getElementsByClassName("price")[0].remove();            
                }        
                books.push(card);
            }
    }      
    });
});