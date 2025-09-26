import { LANGUAGE_TO_FLAG } from "../constants";
import { Link } from "react-router"; // FIXED IMPORT

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md">
      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3 justify-evenly">
          <span className="badge badge-secondary text-xs p-3">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {capitialize(friend.nativeLanguage)}
          </span>
          <span className="badge badge-outline text-xs p-3">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {capitialize(friend.learningLanguage)}
          </span>
        </div>
        <Link to={`/chat/${friend._id}`}>
          <div className="btn btn-outline w-full hover:bg-primary">Message</div>
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
}
const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
