import { useState, useEffect } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api.js";
import { useQueryClient } from "@tanstack/react-query";
import { CameraIcon, Globe, Loader, Loader2, MapPinIcon } from "lucide-react";
import { ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants/index.js";
import { Toaster } from "react-hot-toast";

const AVATAR_URLS = Array.from({ length: 100 }, (_, i) =>
  `https://avatar.iran.liara.run/public/${i}.png`
);

const OnboardingPage = () => {
  const { authUser } = useAuthUser();

  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const {
    mutate: onboardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error?.response?.data?.message);
    }
  }, [error]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  return (
    <div
      className="min-h-screen bg-base-100 flex items-center justify-center p-4"
      data-theme="forest"
    >
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="card-title text-2xl mb-6 font-bold sm:text-3xl flex justify-center">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image preview section */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <CameraIcon className="size-12 text-base-content opacity-40" />
                )}
              </div>
              {/* change avatar button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(true)}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Pick profile Avatar
                </button>
              </div>
            </div>
            {/* enter fullname */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Full Name:</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered rounded-xl w-full"
                placeholder="Your full name"
              />
            </div>
            {/* enter bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Bio:</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered rounded-xl w-full"
                placeholder="Tell us about yourself"
              />
            </div>
            {/* Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* native Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Native Language:</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered rounded-xl w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
              {/* Learning Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Learning Language:
                  </span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered rounded-xl w-full"
                >
                  <option value="">Select your learning language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold">Location:</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content" />
                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered rounded-xl w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
            {/* submit btn */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <Globe className="size-5" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <Loader className="size-5 animate-spin" />
                  Submitting...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {/* avatar picker box */}
      {showAvatarPicker && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-400">Pick Your Avatar</h2>
      <div className="grid grid-cols-5 gap-4 max-h-[400px] overflow-y-auto">
        {AVATAR_URLS.map((url, idx) => (
          <button
            key={url}
            type="button"
            className={`border-2 rounded-full overflow-hidden focus:outline-none ${
              formState.profilePic === url
                ? "border-blue-500"
                : "border-transparent"
            }`}
            onClick={() => {
              setFormState((prev) => ({ ...prev, profilePic: url }));
              setShowAvatarPicker(false);
              toast.success("Profile picture updated!");
            }}
          >
            <img src={url} alt={`Avatar ${idx}`} className="w-16 h-16 object-cover" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-sm btn-error mt-6"
        onClick={() => setShowAvatarPicker(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default OnboardingPage;
