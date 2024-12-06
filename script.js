let playlist = [];
let currentSongIndex = 0;
let isPlaying = false;

const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songList = document.getElementById('songList');
const progress = document.querySelector('.progress');

// Handle file selection
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        if (file.type === 'audio/mp3' || file.type === 'audio/mpeg') {
            addSongToPlaylist(file);
        }
    });
    event.target.value = ''; // Reset file input
}

// Add song to playlist
function addSongToPlaylist(file) {
    const song = {
        name: file.name.replace('.mp3', ''),
        file: URL.createObjectURL(file),
        fileName: file.name
    };
    
    playlist.push(song);
    updatePlaylist();
    
    // If this is the first song, load it
    if (playlist.length === 1) {
        loadSong(0);
    }
}

// Add song button click handler
function addSong() {
    const fileInput = document.getElementById('songFile');
    const files = fileInput.files;
    
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            if (file.type === 'audio/mp3' || file.type === 'audio/mpeg') {
                addSongToPlaylist(file);
            }
        });
        fileInput.value = ''; // Reset file input
    } else {
        alert('Please select an MP3 file');
    }
}

// Update playlist display
function updatePlaylist() {
    songList.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'song-item';
        if (index === currentSongIndex && isPlaying) {
            li.classList.add('playing');
        }

        li.innerHTML = `
            <div class="song-info">
                <i class="fas fa-music"></i>
                <span>${song.name}</span>
            </div>
            <div class="song-controls">
                <button onclick="playSong(${index})" class="play-btn">
                    <i class="fas ${index === currentSongIndex && isPlaying ? 'fa-pause' : 'fa-play'}"></i>
                </button>
                <button onclick="removeSong(${index})" class="delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        songList.appendChild(li);
    });
}

// Load song
function loadSong(index) {
    if (playlist[index]) {
        audioPlayer.src = playlist[index].file;
        currentSongIndex = index;
        updateCurrentSong();
    }
}

// Play song
function playSong(index) {
    if (index === currentSongIndex && isPlaying) {
        pauseSong();
    } else {
        loadSong(index);
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                updatePlayButton();
                updatePlaylist();
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                alert('Error playing this file');
            });
    }
}

// Pause song
function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButton();
    updatePlaylist();
}

// Remove song
function removeSong(index) {
    if (confirm('Remove this song from playlist?')) {
        // Revoke the URL to free up memory
        URL.revokeObjectURL(playlist[index].file);
        
        playlist.splice(index, 1);
        if (index === currentSongIndex) {
            audioPlayer.src = '';
            isPlaying = false;
            currentSongIndex = 0;
        }
        updatePlaylist();
        updateCurrentSong();
    }
}

// Toggle play/pause
function togglePlay() {
    if (playlist.length === 0) {
        alert('Please add some songs to the playlist');
        return;
    }

    if (isPlaying) {
        pauseSong();
    } else {
        playSong(currentSongIndex);
    }
}

// Play next song
function playNext() {
    if (playlist.length === 0) return;
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    playSong(nextIndex);
}

// Play previous song
function playPrev() {
    if (playlist.length === 0) return;
    const prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    playSong(prevIndex);
}

// Update play button
function updatePlayButton() {
    playBtn.innerHTML = isPlaying ? 
        '<i class="fas fa-pause"></i>' : 
        '<i class="fas fa-play"></i>';
}

// Update current song display
function updateCurrentSong() {
    const currentSong = document.getElementById('currentSong');
    if (playlist[currentSongIndex]) {
        currentSong.textContent = playlist[currentSongIndex].name;
    } else {
        currentSong.textContent = 'No song playing';
    }
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);

// Update progress bar
audioPlayer.addEventListener('timeupdate', () => {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${progressPercent}%`;
});

// Play next song when current song ends
audioPlayer.addEventListener('ended', playNext);

// Progress bar click handling
document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const progressBarWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / progressBarWidth) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initial playlist update
    updatePlaylist();
});