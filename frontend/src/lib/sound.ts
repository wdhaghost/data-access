export function playSuccessSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    oscillator3.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.frequency.setValueAtTime(233.08, audioContext.currentTime); 
    oscillator2.frequency.setValueAtTime(466.16, audioContext.currentTime); 
    oscillator3.frequency.setValueAtTime(349.23, audioContext.currentTime); 

    oscillator1.type = 'sawtooth';
    oscillator2.type = 'sawtooth';
    oscillator3.type = 'square';

    const duration = 1.2;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration); 

    oscillator1.frequency.linearRampToValueAtTime(235, audioContext.currentTime + 0.1);
    oscillator1.frequency.linearRampToValueAtTime(233, audioContext.currentTime + duration);

    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator3.start(audioContext.currentTime);

    oscillator1.stop(audioContext.currentTime + duration);
    oscillator2.stop(audioContext.currentTime + duration);
    oscillator3.stop(audioContext.currentTime + duration);

    setTimeout(() => {
      audioContext.close();
    }, duration * 1000 + 100);
  } catch (error) {
    console.error('Erreur lors de la lecture du son:', error);
  }
}
