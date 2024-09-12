import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  inventoryCount: number;
}

const productSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  inventoryCount: { type: Number, required: true },
});

export default mongoose.model<IProduct>('Product', productSchema);
