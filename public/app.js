class ClipPlayer {
  constructor() {
    this.currentClipIndex = 0

    this.prevButton = document.getElementById('prevButton')
    this.nextButton = document.getElementById('nextButton')
    this.currentClipFrame = document.getElementById('currentClip')

    this.prevButton.addEventListener('click', this.showPreviousClip.bind(this))
    this.nextButton.addEventListener('click', this.showNextClip.bind(this))

    this.getClips().then((clips) => {
      this.clips = clips
      this.displayClip(this.currentClipIndex)
    })
  }

  async getClips() {
    try {
      const response = await fetch('/clips');
      const clips = await response.json();
      return clips;
    } catch (err) {
      console.error('Error while retrieving clips: ' + err);
    }
  }

  displayClip(clipIndex) {
    this.currentClipFrame.src = `${this.clips[clipIndex].embed_url}&parent=localhost&autoplay=false&muted=false`
  }

  showPreviousClip() {
    console.log('showPreviousClip')
    if (this.currentClipIndex > 0) {
      this.currentClipIndex--
      this.displayClip(this.currentClipIndex)
      console.log(this.currentClipIndex)
    }
  }

  showNextClip() {
    console.log('showNextClip')
    if (this.currentClipIndex < this.clips.length - 1) {
      this.currentClipIndex++
      this.displayClip(this.currentClipIndex)
      console.log(this.currentClipIndex)
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ClipPlayer()
})
