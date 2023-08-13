class ClipPlayer {
  constructor() {
    this.currentClipIndex = 0

    this.prevButton = document.getElementById('topArrow')
    this.nextButton = document.getElementById('bottomArrow')
    this.currentClipFrame = document.getElementById('currentClip')

    this.prevButton.addEventListener('click', this.showPreviousClip.bind(this))
    this.nextButton.addEventListener('click', this.showNextClip.bind(this))

    this.getClips().then((clips) => {
      this.clips = clips
      this.displayClip(this.currentClipIndex, null)
    })
  }

  async getClips() {
    try {
      const response = await fetch('/clips')
      const clips = await response.json()
      return clips
    } catch (err) {
      console.error('Error while retrieving clips: ' + err)
    }
  }

  async displayClip(clipIndex, transition) {
    this.currentClipFrame.src = `${this.clips[clipIndex].embed_url}&parent=localhost&autoplay=false&muted=false`
    
    if (transition === 'slide-in-up') {
      this.currentClipFrame.classList.add('slide-in-up')
      this.currentClipFrame.addEventListener('animationend', () => {
        this.currentClipFrame.classList.remove('slide-in-up')
      })
    } else if (transition === 'slide-in-down') {
      this.currentClipFrame.classList.add('slide-in-down')
      this.currentClipFrame.addEventListener('animationend', () => {
        this.currentClipFrame.classList.remove('slide-in-down')
      })
    }
  }

  async showPreviousClip() {
    if (this.currentClipIndex > 0) {
      const previousClipIndex = this.currentClipIndex - 1

      this.currentClipFrame.classList.add('slide-out-down')
      this.currentClipFrame.addEventListener('animationend', () => {
        this.currentClipFrame.classList.remove('slide-out-down')
        this.currentClipIndex = previousClipIndex
        this.displayClip(this.currentClipIndex, 'slide-in-down')
      })
    }
  }

  async showNextClip() {
    if (this.currentClipIndex < this.clips.length - 1) {
      const nextClipIndex = this.currentClipIndex + 1

      this.currentClipFrame.classList.add('slide-out-up')
      this.currentClipFrame.addEventListener('animationend', () => {
        this.currentClipFrame.classList.remove('slide-out-up')
        this.currentClipIndex = nextClipIndex
        this.displayClip(this.currentClipIndex, 'slide-in-up')
      })
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ClipPlayer()
})
