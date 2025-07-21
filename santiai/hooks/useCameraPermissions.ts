import { useEffect, useState } from 'react';
import { Camera } from 'expo-camera';

export function useCameraPermissions() {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setIsLoading(false);
    })();
  }, []);

  return { hasPermission, isLoading };
} 