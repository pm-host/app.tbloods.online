
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
            
            // Enhanced Video Player Functionality
            const video = document.getElementById('tutorialVideo');
            const overlay = document.getElementById('videoOverlay');
            const playButton = document.getElementById('playButton');
            const videoControls = document.getElementById('videoControls');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const stopBtn = document.getElementById('stopBtn');
            const skipBackBtn = document.getElementById('skipBackBtn');
            const skipForwardBtn = document.getElementById('skipForwardBtn');
            const progressBar = document.getElementById('progressBar');
            const progressFilled = document.getElementById('progressFilled');
            const progressBuffered = document.getElementById('progressBuffered');
            const progressHover = document.getElementById('progressHover');
            const progressTooltip = document.getElementById('progressTooltip');
            const timeDisplay = document.getElementById('timeDisplay');
            const volumeBtn = document.getElementById('volumeBtn');
            const volumeSlider = document.getElementById('volumeSlider');
            const volumeFilled = document.getElementById('volumeFilled');
            const speedSelector = document.getElementById('speedSelector');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            const qualityBtn = document.getElementById('qualityBtn');
            const qualitySelector = document.getElementById('qualitySelector');
            const qualityBtns = document.querySelectorAll('.quality-btn');
            const pipBtn = document.getElementById('pipBtn');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const captionsDisplay = document.getElementById('captionsDisplay');
            const statsOverlay = document.getElementById('statsOverlay');
            const playbackRateDisplay = document.getElementById('playbackRateDisplay');
            
            let controlsTimeout;
            let isDraggingProgress = false;
            let isDraggingVolume = false;
            
            // Show/hide controls
            function showControls() {
                videoControls.classList.add('show');
                clearTimeout(controlsTimeout);
                controlsTimeout = setTimeout(() => {
                    if (!video.paused && !isDraggingProgress && !isDraggingVolume) {
                        videoControls.classList.remove('show');
                    }
                }, 3000);
            }
            
            // Play/Pause functionality
            function togglePlay() {
                if (video.paused) {
                    video.play();
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    overlay.classList.add('hidden');
                } else {
                    video.pause();
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    overlay.classList.remove('hidden');
                }
                showControls();
            }
            
            // Stop functionality
            function stopVideo() {
                video.pause();
                video.currentTime = 0;
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                overlay.classList.remove('hidden');
                showControls();
            }
            
            // Skip functionality
            function skip(seconds) {
                video.currentTime += seconds;
                showControls();
            }
            
            // Format time
            function formatTime(seconds) {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                seconds = Math.floor(seconds % 60);
                
                if (hours > 0) {
                    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                }
                return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
            
            // Update progress
            function updateProgress() {
                const percent = (video.currentTime / video.duration) * 100;
                progressFilled.style.width = `${percent}%`;
                timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
                
                // Update playback rate display
                playbackRateDisplay.textContent = `${video.playbackRate}x`;
                playbackRateDisplay.classList.add('show');
                setTimeout(() => playbackRateDisplay.classList.remove('show'), 2000);
            }
            
            // Update buffered progress
            function updateBuffered() {
                if (video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                    const duration = video.duration;
                    if (duration > 0) {
                        progressBuffered.style.width = `${(bufferedEnd / duration) * 100}%`;
                    }
                }
            }
            
            // Progress bar click and drag
            function scrub(e) {
                const rect = progressBar.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const scrubTime = (x / progressBar.offsetWidth) * video.duration;
                video.currentTime = scrubTime;
                showControls();
            }
            
            function updateProgressHover(e) {
                const rect = progressBar.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = (x / progressBar.offsetWidth) * 100;
                const hoverTime = (percent / 100) * video.duration;
                
                progressHover.style.width = `${percent}%`;
                progressTooltip.textContent = formatTime(hoverTime);
                progressTooltip.style.left = `${x}px`;
                progressTooltip.classList.add('show');
            }
            
            // Volume control
            function updateVolume() {
                const volume = video.volume;
                volumeFilled.style.width = `${volume * 100}%`;
                
                // Update volume icon
                if (video.muted || volume === 0) {
                    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                } else if (volume < 0.5) {
                    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
                } else {
                    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            }
            
            function toggleMute() {
                video.muted = !video.muted;
                if (video.muted) {
                    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    volumeFilled.style.width = '0%';
                } else {
                    updateVolume();
                }
                showControls();
            }
            
            function changeVolume(e) {
                const rect = volumeSlider.getBoundingClientRect();
                const x = e.clientX - rect.left;
                let volume = x / volumeSlider.offsetWidth;
                volume = Math.max(0, Math.min(1, volume));
                
                video.volume = volume;
                video.muted = false;
                updateVolume();
                showControls();
            }
            
            // Speed control
            function changeSpeed() {
                video.playbackRate = parseFloat(speedSelector.value);
                showControls();
            }
            
            // Quality selector
            function toggleQualitySelector() {
                qualitySelector.classList.toggle('show');
            }
            
            function changeQuality(quality) {
                // In a real implementation, this would switch video sources
                console.log('Changing quality to:', quality);
                qualityBtns.forEach(btn => {
                    if (btn.dataset.quality === quality) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
                qualitySelector.classList.remove('show');
                showControls();
            }
            
            // Picture in Picture
            function togglePip() {
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                } else if (document.pictureInPictureEnabled) {
                    video.requestPictureInPicture();
                }
                showControls();
            }
            
            // Fullscreen control
            function toggleFullscreen() {
                if (!document.fullscreenElement) {
                    video.requestFullscreen().catch(err => {
                        console.log(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    document.exitFullscreen();
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                }
                showControls();
            }
            
            // Loading indicator
            function showLoading() {
                loadingSpinner.classList.add('show');
            }
            
            function hideLoading() {
                loadingSpinner.classList.remove('show');
            }
            
            // Show video stats
            function showStats() {
                const stats = `
                    Resolution: ${video.videoWidth}×${video.videoHeight}<br>
                    Bitrate: ${Math.round(video.buffered.end(0) / video.duration * 1000)} kbps<br>
                    Buffer: ${Math.round(video.buffered.end(0))}s
                `;
                statsOverlay.innerHTML = stats;
                statsOverlay.classList.add('show');
            }
            
            // Hide video stats
            function hideStats() {
                statsOverlay.classList.remove('show');
            }
            
            // Event listeners
            playButton.addEventListener('click', togglePlay);
            playPauseBtn.addEventListener('click', togglePlay);
            stopBtn.addEventListener('click', stopVideo);
            skipBackBtn.addEventListener('click', () => skip(-10));
            skipForwardBtn.addEventListener('click', () => skip(10));
            progressBar.addEventListener('click', scrub);
            
            // Progress bar hover
            progressBar.addEventListener('mousemove', updateProgressHover);
            progressBar.addEventListener('mouseleave', () => {
                progressHover.style.width = '0%';
                progressTooltip.classList.remove('show');
            });
            
            // Progress bar drag
            progressBar.addEventListener('mousedown', (e) => {
                isDraggingProgress = true;
                scrub(e);
                document.addEventListener('mousemove', scrub);
                document.addEventListener('mouseup', () => {
                    isDraggingProgress = false;
                    document.removeEventListener('mousemove', scrub);
                });
            });
            
            volumeBtn.addEventListener('click', toggleMute);
            volumeSlider.addEventListener('click', changeVolume);
            
            // Volume slider drag
            volumeSlider.addEventListener('mousedown', (e) => {
                isDraggingVolume = true;
                changeVolume(e);
                document.addEventListener('mousemove', changeVolume);
                document.addEventListener('mouseup', () => {
                    isDraggingVolume = false;
                    document.removeEventListener('mousemove', changeVolume);
                });
            });
            
            speedSelector.addEventListener('change', changeSpeed);
            qualityBtn.addEventListener('click', toggleQualitySelector);
            qualityBtns.forEach(btn => {
                btn.addEventListener('click', () => changeQuality(btn.dataset.quality));
            });
            pipBtn.addEventListener('click', togglePip);
            fullscreenBtn.addEventListener('click', toggleFullscreen);
            
            video.addEventListener('timeupdate', updateProgress);
            video.addEventListener('progress', updateBuffered);
            video.addEventListener('loadedmetadata', updateProgress);
            video.addEventListener('click', togglePlay);
            video.addEventListener('play', () => {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                overlay.classList.add('hidden');
            });
            video.addEventListener('pause', () => {
                playButton.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                overlay.classList.remove('hidden');
            });
            video.addEventListener('ended', () => {
                playButton.innerHTML = '<i class="fas fa-redo"></i>';
                playPauseBtn.innerHTML = '<i class="fas fa-redo"></i>';
                overlay.classList.remove('hidden');
            });
            video.addEventListener('waiting', showLoading);
            video.addEventListener('playing', hideLoading);
            video.addEventListener('canplay', hideLoading);
            
            // Show controls on video hover
            video.addEventListener('mouseenter', showControls);
            video.addEventListener('mouseleave', () => {
                if (!video.paused && !isDraggingProgress && !isDraggingVolume) {
                    videoControls.classList.remove('show');
                }
            });
            
            // Fullscreen change events
            document.addEventListener('fullscreenchange', () => {
                if (!document.fullscreenElement) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                }
            });
            
            // Picture in Picture events
            video.addEventListener('enterpictureinpicture', () => {
                pipBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
            });
            
            video.addEventListener('leavepictureinpicture', () => {
                pipBtn.innerHTML = '<i class="fas fa-picture-in-picture"></i>';
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if (e.target === video || video.contains(e.target)) {
                    switch(e.key) {
                        case ' ':
                            e.preventDefault();
                            togglePlay();
                            break;
                        case 'ArrowLeft':
                            skip(-5);
                            break;
                        case 'ArrowRight':
                            skip(5);
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            video.volume = Math.min(1, video.volume + 0.1);
                            updateVolume();
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            video.volume = Math.max(0, video.volume - 0.1);
                            updateVolume();
                            break;
                        case 'f':
                        case 'F':
                            toggleFullscreen();
                            break;
                        case 'm':
                        case 'M':
                            toggleMute();
                            break;
                        case 'k':
                        case 'K':
                            togglePlay();
                            break;
                        case 's':
                        case 'S':
                            showStats();
                            setTimeout(hideStats, 3000);
                            break;
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            video.currentTime = (parseInt(e.key) / 10) * video.duration;
                            break;
                    }
                }
            });
            
            // Touch events for mobile
            let touchStartX = 0;
            let touchStartY = 0;
            let touchStartTime = 0;
            
            video.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                touchStartTime = Date.now();
                showControls();
            });
            
            video.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const deltaX = touchEndX - touchStartX;
                const deltaY = touchEndY - touchStartY;
                const touchDuration = Date.now() - touchStartTime;
                
                // Horizontal swipe for skip
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    if (deltaX > 0) {
                        skip(10);
                    } else {
                        skip(-10);
                    }
                }
                // Vertical swipe for volume
                else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                    if (deltaY < 0) {
                        video.volume = Math.min(1, video.volume + 0.1);
                    } else {
                        video.volume = Math.max(0, video.volume - 0.1);
                    }
                    updateVolume();
                }
                // Tap for play/pause
                else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && touchDuration < 300) {
                    togglePlay();
                }
            });
            
            // Double tap for fullscreen on mobile
            let lastTap = 0;
            video.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 300 && tapLength > 0) {
                    toggleFullscreen();
                    e.preventDefault();
                }
                lastTap = currentTime;
            });
            
            // Initialize volume display
            updateVolume();
            
            // Check for Picture in Picture support
            if (!document.pictureInPictureEnabled) {
                pipBtn.style.display = 'none';
            }
        });
