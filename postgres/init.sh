#!/bin/bash

. ../.env
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -a -f ./init.sql > ./logs/init.txt