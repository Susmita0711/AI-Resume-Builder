const resumeUpload = document.getElementById('resumeUpload');
const resumeText = document.getElementById('resumeText');
const fileName = document.getElementById('fileName');
const wordCount = document.getElementById('wordCount');
const analyzeButton = document.getElementById('analyzeButton');
const scoreBadge = document.getElementById('scoreBadge');
const structureScore = document.getElementById('structureScore');
const keywordScore = document.getElementById('keywordScore');
const impactScore = document.getElementById('impactScore');
const readabilityScore = document.getElementById('readabilityScore');
const structureBar = document.getElementById('structureBar');
const keywordBar = document.getElementById('keywordBar');
const impactBar = document.getElementById('impactBar');
const readabilityBar = document.getElementById('readabilityBar');
const suggestionList = document.getElementById('suggestionList');
const livePreview = document.getElementById('livePreview');
const summaryPreview = document.getElementById('summaryPreview');
const strengthsList = document.getElementById('strengthsList');
const skillsList = document.getElementById('skillsList');
const downloadPdfButton = document.getElementById('downloadPdfButton');
const uploadBlock = document.getElementById('uploadBlock');
const toastContainer = document.getElementById('toastContainer');
const themeToggle = document.getElementById('themeToggle');
const originalDownloadButtonHtml = downloadPdfButton.innerHTML;

let activeTheme = 'light';
function setTheme(theme) {
  activeTheme = theme;
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto rounded-3xl px-5 py-4 text-sm shadow-xl transition ${
    type === 'success'
      ? 'bg-emerald-500 text-white'
      : type === 'danger'
      ? 'bg-rose-500 text-white'
      : 'bg-slate-900 text-white'
  }`;
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function parseText(input) {
  return input
    .replace(/\r/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function updateWordCount(text) {
  const count = parseText(text).length === 0 ? 0 : parseText(text).split(' ').length;
  wordCount.textContent = `${count.toLocaleString()} words`;
}

function extractPreviewSections(text) {
  const lines = text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const summary = lines.slice(0, 3).join(' ');
  const strengths = [];
  const skills = [];
  const keyPhrases = ['lead', 'built', 'delivered', 'optimized', 'implemented', 'managed', 'improved', 'designed'];

  lines.slice(0, 10).forEach((line) => {
    const lower = line.toLowerCase();
    if (keyPhrases.some((phrase) => lower.includes(phrase)) && strengths.length < 4) {
      strengths.push(line);
    }
    if (lower.includes('python') || lower.includes('javascript') || lower.includes('react') || lower.includes('aws') || lower.includes('sql')) {
      skills.push(line.replace(/.*?\b(python|javascript|react|aws|sql)\b.*/i, '$1').toUpperCase());
    }
  });

  return {
    summary: summary || 'Paste your resume or upload a file to see a full preview here.',
    strengths: strengths.length > 0 ? strengths : ['Use strong action verbs.', 'Focus on measurable results.'],
    skills: [...new Set(skills)].slice(0, 6),
  };
}

function setPreview(text) {
  const previewData = extractPreviewSections(text);
  summaryPreview.textContent = previewData.summary;
  strengthsList.innerHTML = previewData.strengths
    .map((item) => `<li class="list-disc pl-4">${item}</li>`)
    .join('');
  skillsList.innerHTML = previewData.skills.length
    ? previewData.skills.map((skill) => `<li class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">${skill}</li>`).join('')
    : '<li class="text-slate-500 dark:text-slate-400">Add technical skills to your resume for a stronger preview.</li>';
}

function renderSuggestions(analysis) {
  const suggestions = [];
  if (analysis.keyword < 70) {
    suggestions.push('Add more relevant keywords from the job description to improve ATS matching.');
  }
  if (analysis.structure < 75) {
    suggestions.push('Use clear section headings and concise bullet points for a more readable structure.');
  }
  if (analysis.impact < 70) {
    suggestions.push('Turn responsibilities into achievements by adding measurable outcomes.');
  }
  if (analysis.readability < 75) {
    suggestions.push('Shorten long sentences and keep each bullet under two lines for better readability.');
  }
  if (!analysis.resumeText.includes('www') && !analysis.resumeText.includes('@')) {
    suggestions.push('Include contact details and a LinkedIn URL so recruiters can connect easily.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Your resume looks great! Keep the structure clean and keywords aligned with the job description.');
  }

  suggestionList.innerHTML = suggestions
    .map((suggestion) => `<div class="rounded-3xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-950/80 dark:text-slate-200">${suggestion}</div>`)
    .join('');
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function updateScoreDisplay(score) {
  scoreBadge.textContent = `${score} / 100`;
  scoreBadge.className = scoreBadge.className.replace(/bg-[^ ]+|text-[^ ]+/g, '');
  scoreBadge.classList.add('rounded-full', 'px-4', 'py-2', 'text-sm', 'font-semibold');
  if (score >= 85) {
    scoreBadge.classList.add('bg-emerald-100', 'text-emerald-800');
  } else if (score >= 70) {
    scoreBadge.classList.add('bg-sky-100', 'text-sky-800');
  } else {
    scoreBadge.classList.add('bg-rose-100', 'text-rose-800');
  }
}

function setBar(barEl, value) {
  barEl.style.width = `${value}%`;
}

function analyzeResume(text) {
  const normalized = parseText(text);
  const totalWords = normalized.length === 0 ? 0 : normalized.split(' ').length;
  const hasSections = /experience|education|skills|projects/i.test(text) ? 1 : 0;
  const keywordCount = (text.match(/\b(project|managed|designed|built|optimized|led|implemented|analysis|strategy|performance|product)\b/gi) || []).length;
  const sentenceCount = text.split(/[.!?]\s+/).filter(Boolean).length;
  const longSentencePenalty = Math.max(0, (text.split(/\n/).filter(Boolean).length - 12) * 2);

  const structure = clampScore((hasSections * 40) + Math.min(60, 20 + keywordCount * 4) - longSentencePenalty);
  const keyword = clampScore(Math.min(100, 20 + keywordCount * 6));
  const impact = clampScore(30 + Math.min(70, keywordCount * 5) + (hasSections ? 10 : 0));
  const readability = clampScore(70 + Math.max(0, 10 - longSentencePenalty) - Math.max(0, (totalWords / Math.max(1, sentenceCount)) - 20));
  const score = clampScore(Math.round((structure + keyword + impact + readability) / 4));

  return {
    structure,
    keyword,
    impact,
    readability,
    overall: score,
    resumeText: text,
  };
}

function displayAnalysis(result) {
  updateScoreDisplay(result.overall);
  structureScore.textContent = `${result.structure}%`;
  keywordScore.textContent = `${result.keyword}%`;
  impactScore.textContent = `${result.impact}%`;
  readabilityScore.textContent = `${result.readability}%`;
  setBar(structureBar, result.structure);
  setBar(keywordBar, result.keyword);
  setBar(impactBar, result.impact);
  setBar(readabilityBar, result.readability);
  renderSuggestions(result);
}

async function handleFile(file) {
  if (!file) return;
  const extension = file.name.split('.').pop()?.toLowerCase();
  const supportedExtensions = ['txt', 'md', 'pdf'];
  if (!extension || !supportedExtensions.includes(extension)) {
    showToast('Unsupported file format. Use .txt, .md, or .pdf', 'danger');
    return;
  }
  fileName.textContent = file.name;
  try {
    if (extension === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdfText = await extractTextFromPdf(arrayBuffer);
      resumeText.value = pdfText || '';
    } else {
      resumeText.value = await file.text();
    }
    const text = resumeText.value;
    updateWordCount(text);
    setPreview(text);
    showToast('Resume loaded successfully.', 'success');
  } catch (error) {
    showToast('Could not parse resume file.', 'danger');
  }
}

function enableLoading(button, loading) {
  button.disabled = loading;
  button.classList.toggle('opacity-70', loading);
}

resumeUpload.addEventListener('change', async (event) => {
  await handleFile(event.target.files[0]);
});

uploadBlock.addEventListener('click', () => resumeUpload.click());
uploadBlock.addEventListener('dragover', (event) => {
  event.preventDefault();
  uploadBlock.classList.add('drag-over');
});
uploadBlock.addEventListener('dragleave', () => uploadBlock.classList.remove('drag-over'));
uploadBlock.addEventListener('drop', async (event) => {
  event.preventDefault();
  uploadBlock.classList.remove('drag-over');
  await handleFile(event.dataTransfer.files[0]);
});

resumeText.addEventListener('input', () => {
  const text = resumeText.value;
  updateWordCount(text);
  setPreview(text);
});

analyzeButton.addEventListener('click', async () => {
  const resumeValue = resumeText.value.trim();
  if (!resumeValue) {
    showToast('Please paste or upload a resume before analyzing.', 'danger');
    return;
  }
  enableLoading(analyzeButton, true);
  analyzeButton.textContent = 'Analyzing...';
  await new Promise((resolve) => setTimeout(resolve, 700));
  const analysis = analyzeResume(resumeValue);
  displayAnalysis(analysis);
  enableLoading(analyzeButton, false);
  analyzeButton.innerHTML = '<span class="material-symbols-outlined">analytics</span> Analyze resume';
  showToast('ATS analysis complete.', 'success');
});

async function extractTextFromPdf(arrayBuffer) {
  try {
    const pdfjsLib = window.pdfjsLib;
    if (!pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.24/pdf.min.js';
      document.head.appendChild(script);
      await new Promise((resolve) => (script.onload = resolve));
    }
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      text += `${pageText}\n\n`;
    }
    return text;
  } catch (err) {
    console.warn('PDF parsing failed', err);
    return '';
  }
}

async function exportPdf() {
  const title = 'AI Resume Preview';
  const element = document.getElementById('previewCard');
  try {
    downloadPdfButton.disabled = true;
    downloadPdfButton.textContent = 'Exporting...';
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: activeTheme === 'dark' ? '#020617' : '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('resume-preview.pdf');
    showToast('PDF exported successfully.', 'success');
  } catch (error) {
    showToast('PDF export failed. Try again.', 'danger');
  } finally {
    downloadPdfButton.disabled = false;
    downloadPdfButton.innerHTML = originalDownloadButtonHtml;
  }
}

downloadPdfButton.addEventListener('click', exportPdf);

themeToggle.addEventListener('click', () => {
  setTheme(activeTheme === 'light' ? 'dark' : 'light');
  themeToggle.querySelector('span').textContent = activeTheme === 'dark' ? 'light_mode' : 'dark_mode';
});

setTheme('light');
async function loadFallback() {
  if (!window.pdfjsLib) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.24/pdf.min.js';
    document.head.appendChild(script);
    await new Promise((resolve) => (script.onload = resolve));
  }
}
loadFallback();
