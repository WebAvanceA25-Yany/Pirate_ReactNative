#!/bin/bash

echo ""
echo "Test Maestro avant push..."

# Tuer le process sur le port 8081
PID=$(lsof -ti:8081)
if [ -n "$PID" ]; then
  kill -9 $PID 2>/dev/null
fi

# Lancer Expo en arrière-plan
# (Laisse tourner dans les logs du terminal)
npx expo start --android &
EXPO_PID=$!

# attendre 15 secondes
sleep 15

# Exécuter les tests Maestro
maestro test .maestro/main_flow.yaml
EXIT_CODE=$?

# Fermer Expo proprement
if [ -n "$EXPO_PID" ]; then
  kill -9 $EXPO_PID 2>/dev/null
  echo "Expo fermé proprement."
else
  echo "Aucun processus Expo trouvé."
fi

# Vérifier le résultat
if [ $EXIT_CODE -ne 0 ]; then
  echo ""
  echo "Test échoué. Push bloqué."
  exit 1
else
  echo ""
  echo "Test réussi. Push autorisé."
  exit 0
fi
