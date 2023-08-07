document.addEventListener('DOMContentLoaded', () => {
  async function getClips() {
    try {
      const response = await fetch('/clips')
      const clips = await response.json()
      const firstClip = clips[0]

      const container = document.getElementById('clip')
      const clipHTML = `
        <iframe
          src="${firstClip.embed_url}&parent=localhost&autoplay=true&muted=false"
          height="480"
          width="854"
          frameborder="0"
          allowfullscreen
          autoplay=true>
        ></iframe>
      `
      container.innerHTML = clipHTML
    }
    catch (err) {
      console.error('Error while retrieving clips: ' + err)
    }
  }

  getClips()
})
