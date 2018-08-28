#!/bin/bash
set -x

cd /tmp/

mongorestore  --db test /mongo/backup/test/
