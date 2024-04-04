const usertab=document.querySelector("[ data-userweather]");
const searchtab=document.querySelector("[data-serachweather]");
const usercontainer=document.querySelector(".weather-container");
const grantaccesscontainer=document.querySelector(".grant-location-container");
const searchform=document.querySelector("[ data-searchform]");
const loadingscreen=document.querySelector(".loading-container");
const userinfocontainer=document.querySelector(".user-info-container");



// initially required variable are api key and current tab

let oldtab=usertab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
oldtab.classList.add("current-tab");
getfromsessionstorage();

function switchtab(newtab){
    if(newtab!=oldtab)
    {
        oldtab.classList.remove("current-tab");
        oldtab=newtab;
        oldtab.classList.add("current-tab");

        if(!searchform.classList.contains("active"))
        {
            userinfocontainer.classList.remove("active");
            grantaccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else
        {
            // mai pahile search vale tab pr tha and now we habve to visible weather tab
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            // ab mai your weather tab me hu so weather display karna hoga so check local storage first for coordinates,if we have saved there. 
            getfromsessionstorage();
        }
    }
}

usertab.addEventListener("click",()=>{
    // pass clicked tab as input
    switchtab(usertab);
});

searchtab.addEventListener("click",()=>{
    // pass clicked tab as input
    switchtab(searchtab);
});

function getfromsessionstorage()
{
    // check coordinate already present in it
    const localcoordinate=sessionStorage.getItem("user-coordinates");
    if(!localcoordinate)
    {
        grantaccesscontainer.classList.add("active");
    }
    else{
        const coordinate=JSON.parse(localcoordinate);
        fetchuserweatherinfo(coordinate);
    }
}


 async function fetchuserweatherinfo(coordinate)
 {
    const {lat,lon}=coordinate;
    // make grant container invisible
    grantaccesscontainer.classList.remove("active");
    // make loder visible
    loadingscreen.classList.add("active");

    // API call
    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await res.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        loadingscreen.classList.remove("active");
        console.log("error found",err)
    }
}

function renderweatherinfo(weatherinfo)
{
    // firstly we have to fetch element
    const cityname=document.querySelector("[data-cityname]");
    const countryicon=document.querySelector("[data-countryicon]");
    const desc=document.querySelector("[ data-weatherdiscription]");
    const weathericon=document.querySelector("[data-weathericon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    // fetch value from weather info object and put in ui element

    cityname.innerText=weatherinfo?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherinfo?.weather?.[0]?.description;
    weathericon.src=`http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherinfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherinfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherinfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherinfo?.clouds?.all}%`;
}

function getlocation(){
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // hw show an alert for no geolocation
    }
}

function showPosition(position){
    const usercoordinate={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinate));
    fetchuserweatherinfo(usercoordinate);
}
const grantaccessbutton=document.querySelector("[data-grantaccess]");
grantaccessbutton.addEventListener("click",getlocation);


const searchinput=document.querySelector("[data-searchinput]");
searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityname=searchinput.value;
    if(cityname===""){
        return;
    }
    else{
        fetchsearchweatherinfo(cityname);
    }
})

async function fetchsearchweatherinfo(city){
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantaccesscontainer.classList.remove("active");

    try{
        const responce=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await responce.json();
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");
        renderweatherinfo(data);
    }
    catch(err){
        console.log("error found",err);
    }
}