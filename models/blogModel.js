import mongoose from "mongoose";

import slugify from "slugify";

import createDomPurify from "dompurify";
import { JSDOM } from "jsdom";
import { marked } from "marked";
const dompurify = createDomPurify(new JSDOM().window);

const blogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("validate", function (next) {
  this.slug = slugify(this.title, { lower: true, strict: true });

  if (this.body) {
    this.body = dompurify.sanitize(marked(this.body));
  }

  next();
});

blogSchema.pre("findOneAndUpdate", function (next) {
  if (this._update.body) {
    this._update.body = dompurify.sanitize(marked(this._update.body));
  }

  next();
});
export default mongoose.model("Blog", blogSchema);
