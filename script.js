fetch(`https://openapi.programming-hero.com/api/videos/categories`)
    .then((res) => res.json())
    .then((data) => createButton(data.data));

var categoryID = null;
const loaddata = (category) => {
    categoryID = category;
    fetch(`https://openapi.programming-hero.com/api/videos/category/${category}`)
        .then((res) => res.json())
        .then((data) => makeVidCard(data.data));
}
loaddata("1000");

const sortVideos = () => {
    fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryID}`)
        .then((res) => res.json())
        .then((data) => {
            const vid = data.data.sort(
                function(a, b) {return parseInt(b.others.views) - parseInt(a.others.views) }
            );
            makeVidCard(vid);
        });
}

function goHome() {window.location.href = 'index.html';}
function openBlog() {window.location.href = 'blog.html';}

const createButton = (data) => {
    const sortOptions = document.getElementById("sortOptions");
    let activeButton = null;
    data.forEach(Object => {
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-outline-danger", "m-2");
        btn.textContent = Object.category;
        btn.addEventListener("click", () => {
            loaddata(Object.category_id);
            if(activeButton) {activeButton.classList.remove("active");}
            btn.classList.add("active");
            activeButton = btn;
        });
        sortOptions.append(btn);
        if(data.length>0 && !activeButton) {
            btn.classList.add("active");
            activeButton = btn;
        }
    });
};

const makeVidCard = (data) => {
    const videos = document.getElementById("videos");
    videos.innerHTML = ``;
    if(data.length >= 1)
    {
        data.forEach(Object => {
            var timestamp = getTime(parseInt(Object.others.posted_date));
            const VidCard = document.createElement("div");
            VidCard.classList.add('vCard', 'container-fluid', 'col-xsm-6','col-md-4','col-lg-3', 'g-3');
            VidCard.innerHTML = `
            <div class="fs-5 border-0">
                <div class="position-relative">
                    <img class="thumbnail img-fluid" src="${Object.thumbnail}" alt="thumbnail">
                    <p class="timestamp m-0 fw-light bg-dark text-light position-absolute">${timestamp}</p>
                </div>
                <div class="d-flex pt-3">
                    <img class="profile img-fluid" src="${Object.authors[0].profile_picture}" alt="profile">
                    <div class="text-start ps-3">
                        <p class="fs-4 fw-bold m-0">${Object.title}</p>
                        <p class="pb-1 m-0">
                            ${Object.authors[0].profile_name} 
                            ${Object.authors[0].verified ? '<i class="fa-solid fa-circle-check fa-xs" style="color: #0000ff;"></i>' : ''}
                        </p>
                        <p>${Object.others.views}</p>
                    </div>
                </div>  
            </div>
            `
            videos.append(VidCard);
        });
        document.getElementById("sortButton").classList.remove('d-none');
    }
    else
    {
        document.getElementById("sortButton").classList.toggle('d-none');
        videos.innerHTML = `
        <div class="d-flex flex-column align-items-center text-center mt-5">
            <img class="img-fluid" src="icon.png" alt="Error">
            <h2 class="p-4">Oops!! Sorry, There is no content here.</h2>
        </div>
        `
    }

}

const getTime = (sec) => {return (sec) ? Math.floor(sec/3600) + " hrs " + Math.floor((sec%3600)/60) + " min ago" : " ";}