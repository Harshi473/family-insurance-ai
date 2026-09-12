import React, { useState } from "react";

function FamilyDetails({ onBack, onContinue, user }) {

  const [familyName, setFamilyName] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const [members, setMembers] = useState([
    {
      name: "",
      age: "",
      gender: "",
      occupation: "",
      healthConditions: "",
      smoker: "No"
    }
  ]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // ADD FAMILY MEMBER
  // =====================================================

  const addMember = () => {

    setMembers([
      ...members,
      {
        name: "",
        age: "",
        gender: "",
        occupation: "",
        healthConditions: "",
        smoker: "No"
      }
    ]);

  };


  // =====================================================
  // REMOVE FAMILY MEMBER
  // =====================================================

  const removeMember = (index) => {

    if (members.length === 1) {
      return;
    }

    const updatedMembers =
      members.filter(
        (_, memberIndex) =>
          memberIndex !== index
      );

    setMembers(updatedMembers);

  };


  // =====================================================
  // UPDATE MEMBER
  // =====================================================

  const updateMember = (
    index,
    field,
    value
  ) => {

    const updatedMembers =
      [...members];

    updatedMembers[index] = {
      ...updatedMembers[index],
      [field]: value
    };

    setMembers(updatedMembers);

  };


  // =====================================================
  // SUBMIT FAMILY DETAILS
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");


    // -------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------

    if (!user || !user.id) {

      setError(
        "Please login before entering family details."
      );

      return;

    }


    // -------------------------------------------------
    // FAMILY NAME
    // -------------------------------------------------

    if (!familyName.trim()) {

      setError(
        "Please enter a valid family name."
      );

      return;

    }


    if (!/^[A-Za-z\s]+$/.test(
      familyName.trim()
    )) {

      setError(
        "Please enter a valid family name. Numbers are not allowed."
      );

      return;

    }


    // -------------------------------------------------
    // ANNUAL INCOME
    // -------------------------------------------------

    if (!annualIncome) {

      setError(
        "Please select your annual income."
      );

      return;

    }


    // -------------------------------------------------
    // CITY
    // -------------------------------------------------

    if (!city.trim()) {

      setError(
        "Please enter your city."
      );

      return;

    }


    // -------------------------------------------------
    // STATE
    // -------------------------------------------------

    if (!state.trim()) {

      setError(
        "Please enter your state."
      );

      return;

    }


    // -------------------------------------------------
    // FAMILY MEMBERS VALIDATION
    // -------------------------------------------------

    for (
      let i = 0;
      i < members.length;
      i++
    ) {

      const member =
        members[i];


      if (!member.name.trim()) {

        setError(
          `Please enter the name of family member ${i + 1}.`
        );

        return;

      }


      if (!/^[A-Za-z\s]+$/.test(
        member.name.trim()
      )) {

        setError(
          `Please enter a valid name for family member ${i + 1}.`
        );

        return;

      }


      if (!member.age) {

        setError(
          `Please enter the age of family member ${i + 1}.`
        );

        return;

      }


      if (
        Number(member.age) < 1 ||
        Number(member.age) > 100
      ) {

        setError(
          `Please enter a valid age for family member ${i + 1}.`
        );

        return;

      }


      if (!member.gender) {

        setError(
          `Please select the gender of family member ${i + 1}.`
        );

        return;

      }


      if (!member.occupation.trim()) {

        setError(
          `Please enter the occupation of family member ${i + 1}.`
        );

        return;

      }

    }


    // -------------------------------------------------
    // PREPARE DATA
    // -------------------------------------------------

    const family = {

      familyName:
        familyName.trim(),

      annualIncome,

      city:
        city.trim(),

      state:
        state.trim()

    };


    try {

      setLoading(true);


      // -------------------------------------------------
      // SEND DATA TO BACKEND
      // -------------------------------------------------

      const response =
        await fetch(
            "https://family-insurance-ai.onrender.com/api/families",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              userId: user.id,

              family,

              members

            })

          }
        );


      const data =
        await response.json();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          "Failed to save family details."
        );

      }


      console.log(
        "Family saved:",
        data
      );


      // -------------------------------------------------
      // SEND DATA TO RECOMMENDATION PAGE
      // -------------------------------------------------

      onContinue({

        family,

        members,

        familyId:
          data.familyId

      });


    } catch (err) {

      console.error(
        "Family save error:",
        err
      );


      setError(
        err.message ||
        "Unable to save family details."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="details-page">

      <div className="details-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="details-header">

          <button
            type="button"
            className="back-btn"
            onClick={onBack}
          >
            ← Back
          </button>


          <div className="details-logo">

            <div className="logo-shield">

              <span>♡</span>

            </div>


            <div>

              <h2>

                Family<span>Care</span>

              </h2>

              <p>

                Secure Today • Healthy Tomorrow

              </p>

            </div>

          </div>

        </div>



        {/* =================================================
            TITLE
        ================================================= */}

        <div className="details-title">

          <p className="section-label">

            FAMILY DETAILS

          </p>


          <h1>

            Tell Us About Your Family

          </h1>


          <p>

            Enter your family information so FamilyCare
            can find suitable insurance options for you.

          </p>

        </div>



        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="details-form"
          onSubmit={handleSubmit}
        >


          {/* =================================================
              FAMILY INFORMATION
          ================================================= */}

          <div className="form-section">

            <h2>

              Family Information

            </h2>


            <div className="form-grid">


              {/* FAMILY NAME */}

              <div className="form-group">

                <label>

                  Family Name

                </label>


                <input
                  type="text"
                  value={familyName}
                  onChange={(e) =>
                    setFamilyName(
                      e.target.value
                    )
                  }
                  placeholder="Enter family name"
                />

              </div>



              {/* ANNUAL INCOME */}

              <div className="form-group">

                <label>

                  Annual Income

                </label>


                <select
                  value={annualIncome}
                  onChange={(e) =>
                    setAnnualIncome(
                      e.target.value
                    )
                  }
                >

                  <option value="">

                    Select annual income

                  </option>


                  <option value="100000">

                    1 lakh

                  </option>


                  <option value="200000">

                    2 lakh

                  </option>


                  <option value="300000">

                    3 lakh

                  </option>


                  <option value="400000">

                    4 lakh

                  </option>


                  <option value="500000">

                    5 lakh

                  </option>


                  <option value="above_5_lakh">

                    Above 5 lakh

                  </option>


                  <option value="above_10_lakh">

                    Above 10 lakh

                  </option>

                </select>

              </div>



              {/* CITY */}

              <div className="form-group">

                <label>

                  City

                </label>


                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  placeholder="Enter city"
                />

              </div>



              {/* STATE */}

              <div className="form-group">

                <label>

                  State

                </label>


                <input
                  type="text"
                  value={state}
                  onChange={(e) =>
                    setState(
                      e.target.value
                    )
                  }
                  placeholder="Enter state"
                />

              </div>

            </div>

          </div>



          {/* =================================================
              FAMILY MEMBERS
          ================================================= */}

          <div className="form-section">

            <div className="members-title">

              <div>

                <h2>

                  Family Members

                </h2>

                <p>

                  Add details for everyone who needs
                  insurance coverage.

                </p>

              </div>


              <button
                type="button"
                className="add-member-btn"
                onClick={addMember}
              >

                + Add Family Member

              </button>

            </div>



            {/* MEMBERS */}

            {members.map(
              (member, index) => (

                <div
                  className="member-card"
                  key={index}
                >


                  <div className="member-card-header">

                    <h3>

                      Family Member {index + 1}

                    </h3>


                    {members.length > 1 && (

                      <button
                        type="button"
                        className="remove-member-btn"
                        onClick={() =>
                          removeMember(index)
                        }
                      >

                        Remove

                      </button>

                    )}

                  </div>



                  <div className="form-grid">


                    {/* NAME */}

                    <div className="form-group">

                      <label>

                        Name

                      </label>


                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter name"
                      />

                    </div>



                    {/* AGE */}

                    <div className="form-group">

                      <label>

                        Age

                      </label>


                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={member.age}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "age",
                            e.target.value
                          )
                        }
                        placeholder="Enter age"
                      />

                    </div>



                    {/* GENDER */}

                    <div className="form-group">

                      <label>

                        Gender

                      </label>


                      <select
                        value={member.gender}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "gender",
                            e.target.value
                          )
                        }
                      >

                        <option value="">

                          Select gender

                        </option>


                        <option value="Male">

                          Male

                        </option>


                        <option value="Female">

                          Female

                        </option>


                        <option value="Other">

                          Other

                        </option>

                      </select>

                    </div>



                    {/* OCCUPATION */}

                    <div className="form-group">

                      <label>

                        Occupation

                      </label>


                      <input
                        type="text"
                        value={member.occupation}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "occupation",
                            e.target.value
                          )
                        }
                        placeholder="Enter occupation"
                      />

                    </div>



                    {/* HEALTH CONDITIONS */}

                    <div className="form-group full-width">

                      <label>

                        Health Conditions

                      </label>


                      <input
                        type="text"
                        value={
                          member.healthConditions
                        }
                        onChange={(e) =>
                          updateMember(
                            index,
                            "healthConditions",
                            e.target.value
                          )
                        }
                        placeholder="Example: Diabetes, BP, None"
                      />

                    </div>



                    {/* SMOKER */}

                    <div className="form-group">

                      <label>

                        Smoker

                      </label>


                      <select
                        value={member.smoker}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "smoker",
                            e.target.value
                          )
                        }
                      >

                        <option value="No">

                          Non-Smoker

                        </option>


                        <option value="Yes">

                          Smoker

                        </option>

                      </select>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>



          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="form-error">

              {error}

            </div>

          )}



          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="details-submit">

            <button
              type="submit"
              className="continue-btn"
              disabled={loading}
            >

              {loading
                ? "Saving Family Details..."
                : "Continue to Recommendations →"}

            </button>

          </div>


        </form>

      </div>

    </div>

  );

}

export default FamilyDetails;