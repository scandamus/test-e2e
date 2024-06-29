#!/bin/bash

# url="http://backend:8001/health/"
url="https://frontend/health/"

echo "Waiting for backend to start..."
for i in {60..0}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" --insecure "$url")
    echo "status: "${status}
    if [ "$status" -eq 200 ]; then
        echo "backend is ready"
        break;
    fi
    if [ "$i" -eq 0 ]; then
        echo "Error: backend is not ready within expected time."
        exit 1
    fi
    sleep 1
    echo "wait counter: $i"
done

exec "$@"