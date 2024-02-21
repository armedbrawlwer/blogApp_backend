import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALIAAACUCAMAAAAAoYNxAAAAM1BMVEXk5ueutLepsLPP09Xn6erg4uOxt7rq7O3Y29zHy824vcDKztC1ur3b3t+/w8bV2Nmkqq4UqHrHAAAEMElEQVR4nO2c25KkIAxAEYMCKvj/X7vYl9neaW2BYELXcp5m3k6lIgRIWohGo9FoNBqNRqPRaDT+B2AcQWkfWET4k1vnFFDeDPKHzhrNrfQJgKV3XfB8JfzregVVBhvGxQ2/fJ/Ws1lGbr93QIUA7/g+rDsnKpMGYY5979LrJGrKDvDzifEmbX09zmBOfe+YWpIDIkL8CLTjdr2jhkjhW3KoCpJjmeONK3FOiPHNeeYWFmnCG5bZ2KYr836DcLaB7Dv3jOmsc4yDs+JTzhLe4Arz6PKCHJh4nEFnB7kbNIszuHxlaViM+3zjwMLhnJ/JW5gdQ2YsqCB3K73xmLWLvISZvnYGnHFYNKgzAzI3vheoj1UjYoV7QJ4ZiWXyDpa20sDsfE8G2qsvmPDKkjaZAbWPPJQnSuOw9RWIMu3pZMk4QL1BewhMuwk4YKBcMkDj17gAqbIvYUx6BASPXzCCMmXN3JSb8oFyAWPiz+8LF7mlhDLpVvKNG3bOJe1viMuiLyw+o5/NPikTl/gFVjnig9QXHleLXAoQ32MU2LLJX7TxF1zEwqhXhxvS0T/BL0hlcmGBvBdguRLHPTxInsYuRJ3B9CiMWeeYHtEQi4ak3kb+kh1lLmEh+sxnd6a0uJHX3MD0gn1HZVwnMrdxgUoPM+0pdQeVrMwsHEi70pDDwt90lvQ4JecKjDc+dAH/gvrwdEh0MwlDjXxIP0Q0A8+czWZvgLLrifFqKuj2/AfQn1uCbSXf3SswerufHlIOzlc68yD0ZN9mHqS0k65TeCOIbaMl63oTl3JdB9cvoqq5gT1gmzfq+6nvtYIvGDjaZng2xo3bX9w+n9jGuYRatA8RnkxgmkKkvV4U1DjdFaSUN3YehvciaRhm6yYtqtEOHkpPt0/u49YXPkVrvFKCOVVCInhzMMy1691ZE1YQNmkY1eTm+Cruod3N1vCs0yB6TBsJdcEBYeF1sdlwEOzV9oouQ0Dt7MsZ1oPRNNKjctFjXKfS1l9f9J/PIiZazxd3OIAyBTLil7T116UHiCnivJTu3LmrhnFHXaI9YF/6kls6EO7sdIeRvuBGBvwVOfEqbQpfcZToDDhztrpgRoMotRJ/li73RFyiJTzOudQYUomO8FhnV6Raws68pDEX2FbyZj0Rzvg4F+h7SgJ9A00d45szKs60efzjjFCGzKdILPltimX6Z3PIfhnMeYcsROZ9P1ietNjIa20eJz7jvAFGQM6mIsnq2CgwBYUhvS8GOWWNJ6OfgG+1eDonVs9cm8grQ9ohZeT27VLDPFYQ5FCHpoQZioyNoEkIM19x8S8JfaGYX74oyRy/baurbrJSia6OasmLlEsC1oLolei+HkV9RD0kugZN+bW1a5E+VrmWIMcnM/7XOophIzfAar6+QJwyuFXWwhoZZd/XQ5zxs3GlCnbs/gCV4DuWjd8KIAAAAABJRU5ErkJggg=="
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })


const User = mongoose.model("User", UserSchema)
export default User