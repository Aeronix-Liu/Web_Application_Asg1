// Timer class to calculate and display page stay duration
class StayTimer {
  private startTime: Date; // Records the initial time when the page loads
  private timerElement: HTMLElement | null; // DOM element for displaying duration

  // Constructor: Initializes start time and DOM element reference
  constructor(elementId: string) {
    this.startTime = new Date();
    this.timerElement = document.getElementById(elementId);
    this.startTimer(); // Start timing immediately after initialization
  }

  // Formats seconds into "HH:MM:SS" format
  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  }

  // Starts the timer and updates display every second
  private startTimer(): void {
    setInterval(() => {
      const now = new Date();
      // Calculate duration in seconds (current time - start time)
      const duration = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);
      // Update DOM element if it exists
      if (this.timerElement) {
        this.timerElement.textContent = `Duration of Stay: ${this.formatTime(duration)}`;
      }
    }, 1000); // Update every 1000ms (1 second)
  }
}

// Initialize timer when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new StayTimer('stay-duration'); // Pass the ID of the display element
});