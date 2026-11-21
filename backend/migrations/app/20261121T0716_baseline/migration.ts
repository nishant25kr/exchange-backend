#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3a4b6975357f36751aa82c08e7a5d062c60b2200e687c3c2f092258c612ede20/contract';
import endContract from '../../snapshots/3a4b6975357f36751aa82c08e7a5d062c60b2200e687c3c2f092258c612ede20/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Stockbalance',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Stocks',
        columns: [
          col('available', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('locked', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('stockBalanceID', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('available', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('locked', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('password', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Stockbalance',
        constraint: 'Stockbalance_userId_key',
        columns: ['userId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Stocks',
        constraint: 'Stocks_stockBalanceID_key',
        columns: ['stockBalanceID'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Stockbalance',
        foreignKey: {
          name: 'Stockbalance_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Stocks',
        foreignKey: {
          name: 'Stocks_stockBalanceID_fkey',
          columns: ['stockBalanceID'],
          references: { schema: 'public', table: 'Stockbalance', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
