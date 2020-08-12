   
        var img = document.getElementById("container-img");
        var i = 0;
        var paths = ["https://images.pexels.com/photos/568025/pexels-photo-568025.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500", "https://images.pexels.com/photos/3820281/pexels-photo-3820281.jpeg?auto=compress&cs=tinysrgb&dpr=2"];
        var timer = setInterval(function(){
        // If we've reached the end of the array...
        if(i >= paths.length){
            i=0;
        }
            img.src = paths[i++]; // Sete the path to the current counter and then increase the counter
        }, 1500);
    
            // element[0].style.position="absolute";         
    
        
        var elements = document.getElementsByClassName('list-item');

        if(elements.length === 0) {
            document.querySelector('ul').setAttribute('style', 'height: 5rem;')
        }

        if(elements.length === 1) {
            document.querySelector('ul').setAttribute('style', 'height: 7rem;')
        }
    