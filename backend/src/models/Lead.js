const mongoose = require('mongoose');

const { Schema } = mongoose;

const SOURCE_ENUM = ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'];
const STATUS_ENUM = ['new', 'contacted', 'qualified', 'lost', 'won'];

const LeadSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        first_name: { type: String, trim: true },
        last_name: { type: String, trim: true },
        email: { type: String, unique: true, trim: true, lowercase: true, required: true },
        phone: { type: String, trim: true },
        company: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        source: { type: String, enum: SOURCE_ENUM, default: 'other' },
        status: { type: String, enum: STATUS_ENUM, default: 'new' },
        score: { type: Number, min: 0, max: 100, default: 0 },
        lead_value: { type: Number, default: 0 },
        last_activity_at: { type: Date, default: null },
        is_qualified: { type: Boolean, default: false },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Index to ensure email uniqueness per user
LeadSchema.index({ userEmail: 1, email: 1 }, { unique: true });

LeadSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
LeadSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret._id;
        delete ret.__v;
        delete ret.userEmail;
        return ret;
    },
});

module.exports = mongoose.model('Lead', LeadSchema);
module.exports.SOURCE_ENUM = SOURCE_ENUM;
module.exports.STATUS_ENUM = STATUS_ENUM;
