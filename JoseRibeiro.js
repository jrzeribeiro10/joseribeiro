document.addEventListener('scroll', function() {
    const footer = document.querySelector('footer');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (scrollTop + windowHeight >= documentHeight - 10) {
        footer.classList.add('visible');
    } else {
        footer.classList.remove('visible');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const expandVideoButtons = document.querySelectorAll('.expand-video');
    const openGalleryButtons = document.querySelectorAll('.open-gallery');

    expandVideoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoContainer = this.nextElementSibling.nextElementSibling;
            videoContainer.classList.toggle('show');

            if (videoContainer.classList.contains('show')) {
                this.textContent = 'Decrease Video';
            } else {
                this.textContent = 'Expand Video';
            }
        });
    });

    openGalleryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const galleryContainer = this.nextElementSibling.nextElementSibling;
            galleryContainer.classList.toggle('show');

            if (galleryContainer.classList.contains('show')) {
                this.textContent = 'Close Gallery';
            } else {
                this.textContent = 'Open Gallery';
            }
        });
    });

    document.querySelectorAll('.gallery-container').forEach(galleryContainer => {
        const galleryImages = galleryContainer.querySelectorAll('.gallery-image');
        const prevButton = galleryContainer.querySelector('.prev');
        const nextButton = galleryContainer.querySelector('.next');

        if (!prevButton || !nextButton) {
            return;
        }

        let currentImageIndex = 0;

        function updateGalleryImage() {
            galleryImages.forEach((img, index) => {
                img.style.display = 'none';
                img.classList.remove('active');
            });

            galleryImages[currentImageIndex].style.display = 'block';
            galleryImages[currentImageIndex].classList.add('active');
        }

        nextButton.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateGalleryImage();
        });

        prevButton.addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGalleryImage();
        });

        updateGalleryImage();
    });

 // Modal para exibir imagem em tamanho grande
    const bigImageGallery = document.getElementById('bigImageGallery');
    const bigImage = document.getElementById('bigImage');
    const closeModal = document.querySelector('.image .close');

    // Verifique se o modal está inicialmente oculto
    bigImageGallery.style.display = 'none'; // Garante que o modal esteja oculto ao iniciar

    document.querySelectorAll('.gallery-image').forEach(img => {
        img.addEventListener('click', function() {
            bigImageGallery.style.display = 'flex'; // Muda para flex para centralizar a imagem
            bigImage.src = this.src;
        });
    });

    // Fechar o modal
    closeModal.addEventListener('click', function() {
        bigImageGallery.style.display = 'none';
    });

    // Fechar o modal clicando fora da imagem
    bigImageGallery.addEventListener('click', function(event) {
        if (event.target === bigImageGallery) {
            bigImageGallery.style.display = 'none';
        }
    });

    const links = document.querySelectorAll('header nav ul li a');

    for (const link of links) {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        });
    }

    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    window.onscroll = function() {
        scrollFunction();
    };

    function scrollFunction() {
        if (scrollToTopBtn) {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollToTopBtn.style.display = "block";
                scrollToTopBtn.style.opacity = "1";
            } else {
                scrollToTopBtn.style.opacity = "0";
                setTimeout(() => {
                    scrollToTopBtn.style.display = "none";
                }, 300);
            }
        }
    }
});
