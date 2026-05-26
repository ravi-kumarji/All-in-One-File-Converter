const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const previewContainer = document.getElementById('previewContainer');
const convertBtn = document.getElementById('convertBtn');
const statusText = document.getElementById('status');

let selectedFiles = [];

// CLICK TO OPEN

dropZone.addEventListener('click', () => {
  fileInput.click();
});

// FILE INPUT

fileInput.addEventListener('change', (e) => {
  selectedFiles = Array.from(e.target.files);
  renderPreview();
});

// DRAG DROP

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.background = 'rgba(102,102,255,0.08)';
});
dropZone.addEventListener('dragleave', () => {
  dropZone.style.background = 'transparent';
});


dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.style.background = 'transparent';

  selectedFiles = Array.from(e.dataTransfer.files);
  renderPreview();
});

// PREVIEW

function renderPreview(){

  previewContainer.innerHTML = '';

  selectedFiles.forEach(file => {

    const card = document.createElement('div');
    card.className = 'preview-card';

    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);

    const name = document.createElement('div');
    name.className = 'preview-name';
    name.textContent = file.name;

    card.appendChild(img);
    card.appendChild(name);
     previewContainer.appendChild(card);
  });
}

// CONVERT

convertBtn.addEventListener('click', async () => {

  if(selectedFiles.length === 0){
    alert('Please select files');
    return;
  }

  statusText.innerHTML = 'Converting files...';

  const from = document.getElementById('fromFormat').value.toLowerCase();
  const to = document.getElementById('toFormat').value.toLowerCase();

  for(const file of selectedFiles){

    const img = await loadImage(file);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img,0,0);

    if(to === 'pdf'){

      const pdf = new jspdf.jsPDF();
      const data = canvas.toDataURL('image/jpeg');

      pdf.addImage(data,'JPEG',10,10,180,160);
      pdf.save(file.name + '.pdf');
} else {

      canvas.toBlob(blob => {

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name.replace(/\.[^/.]+$/, '') + '.' + to;
        a.click();

      }, 'image/' + to);
    }
  }

  statusText.innerHTML = '✅ Conversion Complete';
});

// IMAGE LOADER
function loadImage(file){

  return new Promise(resolve => {

    const img = new Image();

    img.onload = () => resolve(img);

    img.src = URL.createObjectURL(file);
  });
}