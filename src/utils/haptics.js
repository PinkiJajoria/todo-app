import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const triggerHaptic = async (type = 'light') => {
  try {
    if (type === 'light') {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else if (type === 'medium') {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } else if (type === 'success') {
      await Haptics.notification({ type: NotificationType.Success });
    } else if (type === 'warning') {
      await Haptics.notification({ type: NotificationType.Warning });
    }
  } catch {
    // Fallback to Web Vibration API for mobile browsers
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'light') navigator.vibrate(25);
      else if (type === 'medium') navigator.vibrate(40);
      else if (type === 'success') navigator.vibrate([30, 40, 30]);
      else if (type === 'warning') navigator.vibrate([40, 30, 40]);
    }
  }
};
