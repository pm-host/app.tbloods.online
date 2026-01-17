
        document.addEventListener('DOMContentLoaded', () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });
            const elementsToFadeIn = document.querySelectorAll('.fade-in');
            elementsToFadeIn.forEach(el => observer.observe(el));
            
            const downloadBtn = document.getElementById('downloadBtn');
            
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const referrer = urlParams.get('ref');
                    
                    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
                    downloadBtn.classList.add('downloading');
                    
                    setTimeout(() => {
                        const downloadUrl = 'Tblood_v1.0.0.apk';
                        

                        if (referrer) {
                            console.log('Referrer detected:', referrer);
                        }
                        
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = 'Tblood_v1.1.0.apk';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        downloadBtn.innerHTML = '<i class="fas fa-check"></i> Download Complete!';
                        downloadBtn.classList.remove('downloading');
                        downloadBtn.classList.add('downloaded');
                        
                        setTimeout(() => {
                            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download APK';
                            downloadBtn.classList.remove('downloaded');
                        }, 3000);
                    }, 2000);
                });
            }
        });
