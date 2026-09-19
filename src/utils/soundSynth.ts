/**
 * Procedural Web Audio Synthesizer (Silenciado)
 * Todos los efectos de sonido secundarios han sido desactivados
 * para que únicamente suene la música instrumental de Car's Outside de fondo.
 */

class SoundEngine {
  public startGenerativeAmbient(_volumeLevel: number = 0.25) { }
  public stopGenerativeAmbient() { }
  public setAmbientVolume(_volumeLevel: number) { }
  public getCurrentVolume(): number { return 0; }
  public playClick1() { }
  public playClick2() { }
  public playClick3Explosion() { }
  public playHoverChime() { }
  public playObjectClick() { }
  public playModalClose() { }
  public playShootingStar() { }
  public playPuzzleError() { }
  public playSecretUnlocked() { }
}

export const soundEngine = new SoundEngine();
